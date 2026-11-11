# Access Granted (IAM series) — curriculum
One line = one reel, in order. Reel N uses line N. Level = the "## Level" heading the line sits under.

## Level 01 — IAM Foundations
1. What is IAM and why every company needs it
2. Identity vs account vs credential
3. The 4 A's: Identification, Authentication, Authorization, Accounting
4. 401 vs 403: AuthN failed vs AuthZ failed
5. Identity lifecycle: Joiner, Mover, Leaver
6. Privilege creep and orphan accounts
7. Least privilege and need-to-know
8. Separation of Duties (SoD)
9. Defense in depth: where IAM fits in security
10. Human vs non-human identities
## Level 02 — Authentication Basics
11. Authentication factors: something you know / have / are
12. How passwords are stored: hashing and salting
13. Why bcrypt/Argon2 beat MD5/SHA (slow hashing)
14. Modern password rules (NIST 800-63B)
15. Brute force vs credential stuffing vs password spraying
16. Sessions and cookies: what happens after login
17. Session hijacking and session fixation
18. Account lockout and rate limiting
## Level 03 — MFA and Passwordless
19. MFA vs 2FA vs 2-step verification
20. SMS OTP and why it's weak (SIM swap)
21. TOTP: how authenticator apps generate codes offline
22. Push MFA and MFA fatigue attacks
23. Hardware security keys
24. FIDO2 / WebAuthn explained
25. Passkeys: the end of passwords?
26. Biometrics: where your fingerprint is actually stored
27. Adaptive / risk-based authentication
28. Step-up authentication
29. Account recovery: the weakest link
## Level 04 — Authorization Models
30. Access Control Lists (ACLs)
31. DAC vs MAC
32. RBAC: Role-Based Access Control
33. Role explosion problem
34. ABAC: Attribute-Based Access Control
35. Policy-based access and policy engines (OPA, AWS Cedar)
36. ReBAC and Google Zanzibar
37. Coarse-grained vs fine-grained authorization
38. Permissions vs entitlements vs scopes
39. PEP, PDP, PIP, PAP: authorization architecture
## Level 05 — Directory Services
40. What is a directory service
41. LDAP basics: DN, OU, CN and the tree
42. LDAP bind and search operations
43. Active Directory: domains, trees, forests
44. AD groups and Group Policy (GPO)
45. Kerberos authentication (the ticket system)
46. NTLM and why it's legacy
47. Entra ID (Azure AD) vs on-prem AD
48. Hybrid identity: Entra Connect sync
49. Virtual directories and identity stores
## Level 06 — SSO and SAML
50. What is Single Sign-On
51. Federation and trust: IdP vs SP
52. SAML 2.0 overview
53. Anatomy of a SAML assertion
54. SP-initiated vs IdP-initiated SSO
55. SAML signing certificates and cert-expiry outages
56. WS-Federation (quick overview)
57. SAML attacks: XML signature wrapping (conceptual)
## Level 07 — OAuth 2.0
58. The problem OAuth solves: delegated access (valet key)
59. OAuth roles: resource owner, client, auth server, resource server
60. Authorization Code flow
61. PKCE and why every app needs it
62. Client Credentials flow (machine-to-machine)
63. Device Code flow (smart TV login)
64. Why Implicit and Password grants are dead
65. Access token vs refresh token
66. Scopes and consent screens
67. Token introspection and revocation
68. OAuth 2.1 and common mistakes (redirect URI bugs)
## Level 08 — OpenID Connect and Tokens
69. OIDC = OAuth + identity
70. ID token vs access token
71. JWT structure: header, payload, signature
72. JWT signing: HS256 vs RS256 and JWKS
73. JWT pitfalls: alg=none, key confusion (conceptual)
74. Claims and the UserInfo endpoint
75. Discovery: .well-known/openid-configuration
76. Logout: front-channel vs back-channel
77. Opaque tokens vs JWTs
78. Where to store tokens in a browser (cookies, localStorage, BFF)
## Level 09 — Provisioning and Lifecycle Automation
79. Provisioning vs deprovisioning
80. HR system as the source of truth
81. SCIM protocol
82. Connectors: connected vs disconnected apps
83. Just-in-Time (JIT) provisioning
84. Birthright access
85. Reconciliation: finding accounts that shouldn't exist
## Level 10 — Identity Governance (IGA)
86. What is IGA
87. Access requests and approval workflows
88. Access certifications / reviews
89. The rubber-stamping problem
90. Role mining and role engineering
91. SoD policies and toxic combinations
92. Compliance drivers: SOX, GDPR, ISO 27001, SOC 2
93. IGA tools overview (generic, no logos)
## Level 11 — Privileged Access Management (PAM)
94. What makes an account "privileged"
95. Password vaulting
96. Session recording and monitoring
97. JIT access and zero standing privilege
98. Break-glass accounts
99. Service accounts and credential rotation
100. PAM tools overview (generic, no logos)
## Level 12 — Customer IAM (CIAM)
101. Workforce IAM vs Customer IAM
102. Social login ("Login with Google")
103. Registration and progressive profiling
104. Consent and privacy: GDPR and India's DPDP Act
105. Bot and fraud protection at login
106. CIAM tools overview (generic, no logos)
## Level 13 — Cloud IAM
107. Shared responsibility for cloud identity
108. AWS IAM: users, groups, roles, policies
109. AWS policy evaluation logic (explicit deny wins)
110. AssumeRole and STS temporary credentials
111. Azure RBAC, Entra roles and managed identities
112. GCP IAM: principals, roles, service accounts
113. Workload identity federation (CI to cloud with no keys)
114. Kubernetes RBAC and service accounts
115. Cloud IAM breach story: Capital One 2019
## Level 14 — Non-Human and Machine Identity
116. The NHI explosion: machines outnumber humans
117. API keys vs tokens
118. Secrets management (vaults)
119. PKI, certificates and mTLS
120. SPIFFE / SPIRE workload identity
121. AI agent identity and delegated access
## Level 15 — Zero Trust and Modern Architecture
122. Zero Trust principles: never trust, always verify
123. Conditional access policies
124. Device trust and posture checks
125. ITDR: Identity Threat Detection and Response
126. Continuous access evaluation (CAEP)
127. Decentralized identity and verifiable credentials
## Level 16 — IAM Attacks (conceptual only)
128. Phishing and adversary-in-the-middle (AiTM)
129. Pass-the-hash and pass-the-ticket
130. Golden Ticket attack
131. Kerberoasting
132. Token theft and session replay
133. OAuth consent phishing
134. Breach story: Uber 2022 (MFA fatigue)
135. Breach story: Okta 2023 support system
136. Breach story: SolarWinds and Golden SAML
## Level 17 — IAM Operations and Debugging
137. A day in L2 IAM support
138. Debugging SSO failures: clock skew, wrong audience, expired cert
139. Reading SAML traces and HAR files
140. Debugging OAuth errors: invalid_grant, redirect_uri_mismatch
141. Audit logs and SIEM for identity
142. Change management for IAM (CRs, MOPs)
143. IAM metrics that matter
## Level 18 — Products and Career
144. Okta in 2 minutes (no logo)
145. Keycloak in 2 minutes (no logo)
146. Ping Identity / ForgeRock in 2 minutes (no logo)
147. Microsoft Entra in 2 minutes (no logo)
148. IAM career paths and certifications
