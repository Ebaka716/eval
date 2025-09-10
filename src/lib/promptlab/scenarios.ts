export type Scenario = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  template: string;
};

export const scenarios: Scenario[] = [
  {
    id: "meeting-summary-email",
    title: "Summarize meeting → draft email",
    description: "Turn a transcript into a concise summary and a follow-up email.",
    tags: ["foundations", "chaining"],
    template:
      "You are an assistant that summarizes meetings and drafts follow-up emails.\nInput: <paste transcript>\nConstraints: 5 bullet summary, action items, tone: professional.\nOutput: Summary + Email draft.",
  },
  {
    id: "policy-to-faq",
    title: "Policy document → FAQ",
    description: "Convert a policy document into a concise FAQ for employees.",
    tags: ["foundations"],
    template:
      "You convert a policy document to FAQ entries.\nInput: <paste policy>\nConstraints: Q&A format, keep answers <120 words, cite sections.",
  },
  {
    id: "jd-to-resume",
    title: "Job description → resume tailoring",
    description: "Tailor a resume to match a target job description.",
    tags: ["innovation"],
    template:
      "You tailor a resume to a JD.\nInputs: <resume>, <JD>\nConstraints: bullet edits, highlight impact, keep truthfulness.",
  },
  {
    id: "jira-bug-report",
    title: "Notes → Jira bug report",
    description: "Turn rough notes into a clear, reproducible Jira bug report.",
    tags: ["ux", "jira", "communication"],
    template:
      "You write a Jira bug report.\nInput: <rough notes, screenshots/links>\nConstraints: Include: Summary, Environment, Steps to Reproduce, Expected, Actual, Attachments, Severity. Tone: concise, neutral.",
  },
  {
    id: "standup-update",
    title: "Notes → standup update",
    description: "Convert yesterday’s work and today’s plan into a crisp standup update.",
    tags: ["standup", "communication"],
    template:
      "You write a standup update.\nInput: <yesterday, today, blockers>\nConstraints: Format as: Yesterday, Today, Blockers. Keep each bullet ≤ 16 words. Tone: concise.",
  },
  {
    id: "pr-description",
    title: "Diff summary → PR description",
    description: "Draft a high-quality PR description from a diff summary.",
    tags: ["review", "github", "dev"],
    template:
      "You write a PR description.\nInput: <diff summary / key changes>\nConstraints: Include: Context, Changes, Screenshots/UX impact, Risks, Testing, Rollback. Use markdown headings.",
  },
  {
    id: "code-review-comment",
    title: "Terse feedback → actionable review",
    description: "Transform terse notes into constructive, actionable code review comments.",
    tags: ["review", "ux", "communication"],
    template:
      "You rewrite code review comments.\nInput: <raw notes>\nConstraints: One comment per issue with: What/Why, Suggestion, Impact. Tone: respectful, specific. Include code snippet if helpful.",
  },
  {
    id: "usability-invite-email",
    title: "Details → usability test invite email",
    description: "Compose an email inviting participants to a short usability test.",
    tags: ["ux", "research", "email"],
    template:
      "You write an invite email for a usability test.\nInput: <study purpose, time, incentive, scheduling link>\nConstraints: Subject, Greeting, 3 bullets (purpose/time/incentive), CTA link, Thank you. Tone: friendly, clear.",
  },
  {
    id: "research-to-persona",
    title: "Interview notes → provisional personas",
    description: "Summarize interview notes into 2–3 provisional personas with goals and pains.",
    tags: ["ux", "research"],
    template:
      "You create provisional personas.\nInput: <interview notes>\nConstraints: For each persona include: Name, Role, Goals, Pains, Behaviors, Key quotes. Max 3 personas.",
  },
  {
    id: "handoff-agenda",
    title: "Specs → design-dev handoff agenda",
    description: "Create a meeting agenda for a design-to-dev handoff.",
    tags: ["handoff", "meeting", "ux"],
    template:
      "You write a meeting agenda.\nInput: <feature specs, designs, open questions>\nConstraints: Sections: Objectives, Files/Links, Open Questions, Risks, Decisions Needed, Next Steps. Duration: 30–45 min.",
  },
  {
    id: "jira-acceptance-criteria",
    title: "Task → acceptance criteria",
    description: "Draft acceptance criteria for a UX task.",
    tags: ["jira", "ux", "qa"],
    template:
      "You write acceptance criteria.\nInput: <task summary / user story>\nConstraints: Provide 3–5 Given/When/Then scenarios covering happy path and key edge cases.",
  },
  {
    id: "teams-thread-summary",
    title: "Teams thread → decision log",
    description: "Summarize a Microsoft Teams thread into a decision record with follow-ups.",
    tags: ["communication", "documentation"],
    template:
      "You write a decision log entry.\nInput: <Teams thread text/links>\nConstraints: Include: Context, Decision, Rationale (quotes), Owners, Due dates, Links. Max 150 words.",
  },
  {
    id: "ux-release-notes",
    title: "Changes → UX release notes",
    description: "Create concise release notes emphasizing UX changes and impact.",
    tags: ["release", "ux", "communication"],
    template:
      "You write UX-focused release notes.\nInput: <list of merged changes / screenshots>\nConstraints: Sections: Highlights, User impact, Screens/Flows affected, Known issues. Keep bullets ≤ 14 words.",
  },
];

export function getScenarioById(id: string | null | undefined): Scenario | null {
  if (!id) return null;
  return scenarios.find((s) => s.id === id) ?? null;
}

export function getRandomScenario(previousId?: string | null): Scenario | null {
  if (scenarios.length === 0) return null;
  const pool = scenarios.filter((s) => s.id !== previousId);
  const source = pool.length > 0 ? pool : scenarios;
  return source[Math.floor(Math.random() * source.length)] ?? null;
}


