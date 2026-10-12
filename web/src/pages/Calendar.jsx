import React, {useState} from "react";
import {STAGES, fmtTime} from "../api.js";

const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};
const shift = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Week view of episodes. Colour = stage; the small dot = which pipeline.
export default function Calendar({episodes, pipelines = [], title = "This week", action = null}) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const today = new Date();
  const days = Array.from({length: 7}, (_, i) => shift(weekStart, i));
  const label = `${days[0].toLocaleDateString(undefined, {day: "numeric", month: "short"})} – ${days[6].toLocaleDateString(undefined, {day: "numeric", month: "short"})}`;
  const colorOf = (pid) => ["#FF7A45", "#8FB8FF", "#C9A2FF", "#6FD39C", "#F2D16B"][Math.max(0, pipelines.findIndex((p) => p.id === pid)) % 5];
  return (
    <section className="week" aria-label="Calendar">
      <div className="week-head">
        <h2 className="title-s">{title}</h2>
        <span className="mono dim">{label}</span>
        <div className="week-nav">
          <button className="icobtn" aria-label="Previous week" onClick={() => setWeekStart(shift(weekStart, -7))}>‹</button>
          <button className="btn small" disabled={sameDay(weekStart, startOfWeek(today))} onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
          <button className="icobtn" aria-label="Next week" onClick={() => setWeekStart(shift(weekStart, 7))}>›</button>
        </div>
        {action}
      </div>
      <div className="cal">
        {days.map((day) => {
          const items = episodes.filter((e) => e.at && sameDay(new Date(e.at), day)).sort((a, b) => new Date(a.at) - new Date(b.at));
          const isToday = sameDay(day, today);
          return (
            <div key={day.toISOString()} className={`col ${isToday ? "today" : ""} ${day < startOfWeek(today) || (day < today && !isToday) ? "past" : ""}`}>
              <div className="col-head">
                <span className="mono">{day.toLocaleDateString(undefined, {weekday: "short"}).toUpperCase()}</span>
                <b>{day.getDate()}</b>
                {isToday ? <span className="mono today-tag">TODAY</span> : null}
              </div>
              <div className="col-body">
                {items.map((e) => (
                  <a key={e.id} href={`#/review/${e.id}`} className={`ep ep-${STAGES[e.stage]?.tone || "neutral"}`}>
                    <span className="ep-time mono">
                      <i style={{background: colorOf(e.pipelineId)}} aria-hidden="true" />
                      {fmtTime(e.at)}
                    </span>
                    <span className="ep-title">{e.title}</span>
                    <span className="ep-status mono">{STAGES[e.stage]?.label || e.stage}</span>
                  </a>
                ))}
                {items.length === 0 ? <span className="col-empty" aria-hidden="true" /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
