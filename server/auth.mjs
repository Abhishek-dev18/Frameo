// Email + password accounts with cookie sessions.
// Passwords are hashed with scrypt; sessions are random tokens stored server-side.
import crypto from "node:crypto";
import {db, id, now, event} from "./db.mjs";
import {log} from "../scripts/lib/env.mjs";

const COOKIE = "pixelscript_sid";
const SESSION_DAYS = 30;
export const FREE_CREDITS = 20;

const hash = (password, salt) => crypto.scryptSync(password, salt, 64).toString("hex");
const safeEqual = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

function cookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((c) => c.trim().split("="))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join("="))]),
  );
}

function setSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.insert("sessions", {id: token, userId, createdAt: now(), expiresAt: new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()});
  res.setHeader("Set-Cookie", `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 86400}`);
}

export function publicUser(u) {
  if (!u) return null;
  const {passHash, salt, resetToken, resetExpires, ...rest} = u;
  return rest;
}

export function currentUser(req) {
  const token = cookies(req)[COOKIE];
  if (!token) return null;
  const s = db.find("sessions", (x) => x.id === token);
  if (!s || new Date(s.expiresAt) < new Date()) return null;
  return db.find("users", (u) => u.id === s.userId) || null;
}

export function requireUser(req, res, next) {
  const u = currentUser(req);
  if (!u) return res.status(401).json({error: "Please log in again."});
  req.user = u;
  next();
}

export function requireAdmin(req, res, next) {
  requireUser(req, res, () => (req.user.role === "admin" ? next() : res.status(403).json({error: "Only the admin can do this."})));
}

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function signup(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const name = String(req.body.name || "").trim();
  if (!validEmail(email)) throw new Error("Enter a valid email address.");
  if (password.length < 8) throw new Error("Use at least 8 characters for your password.");
  if (db.find("users", (u) => u.email === email)) throw new Error("An account with this email already exists. Log in instead.");
  const salt = crypto.randomBytes(16).toString("hex");
  const isFirst = db.all("users").length === 0;
  const user = db.insert("users", {
    id: id("usr"),
    email,
    name: name || email.split("@")[0],
    salt,
    passHash: hash(password, salt),
    role: isFirst ? "admin" : "user",
    plan: "free",
    credits: FREE_CREDITS,
    onboarded: false,
    profile: {channelName: "", handle: "", niche: "", language: "English", accent: "#4ADE80"},
    notify: {inApp: true, telegramChatId: "", email: false},
    createdAt: now(),
  });
  event(user.id, `Account created${isFirst ? " (admin)" : ""}. ${FREE_CREDITS} free credits added.`, "good");
  setSession(res, user.id);
  return publicUser(user);
}

export function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const user = db.find("users", (u) => u.email === email);
  if (!user || !safeEqual(hash(String(req.body.password || ""), user.salt), user.passHash)) throw new Error("That email and password don't match.");
  setSession(res, user.id);
  return publicUser(user);
}

export function logout(req, res) {
  const token = cookies(req)[COOKIE];
  if (token) db.remove("sessions", (s) => s.id === token);
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
  return {ok: true};
}

// No email service yet: the reset link is written to the server terminal and activity log.
export function forgot(req) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const user = db.find("users", (u) => u.email === email);
  if (user) {
    const token = crypto.randomBytes(24).toString("hex");
    db.update("users", user.id, {resetToken: token, resetExpires: new Date(Date.now() + 3600000).toISOString()});
    const link = `${req.headers.origin || "http://127.0.0.1:5173"}/#/reset?token=${token}`;
    log(`Password reset link for ${email}: ${link}`);
    console.log(`\n  Password reset link for ${email}:\n  ${link}\n`);
  }
  return {ok: true};
}

export function reset(req, res) {
  const token = String(req.body.token || "");
  const password = String(req.body.password || "");
  const user = db.find("users", (u) => u.resetToken && u.resetToken === token);
  if (!user || new Date(user.resetExpires) < new Date()) throw new Error("This reset link has expired. Ask for a new one.");
  if (password.length < 8) throw new Error("Use at least 8 characters for your password.");
  const salt = crypto.randomBytes(16).toString("hex");
  db.update("users", user.id, {salt, passHash: hash(password, salt), resetToken: null, resetExpires: null});
  db.remove("sessions", (s) => s.userId === user.id);
  setSession(res, user.id);
  return publicUser(db.find("users", (u) => u.id === user.id));
}
