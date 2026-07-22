# Agent Rules & Instructions

## Planning before implementation
- Everytime I prompt you for implemention, you must plan first and save it inside ```docs/plans/``` , name it also like this ```<timestamp>-task-name-plan.md```
- Only after saving the plan you can start the implementation, unless I stated "no need for planning" or similar words.
- Ask me also if there are vague requirements, and do not assume things.
- Do not auto implement it after planning, ask me if you should proceed.
- We will use Sonnet or Gemini High Pro for planning, but always use Sonnet first.
- We will use Gemini 3.6 Flash (High) for implementation.

## Specs to implement
- The backlogs.md in docs/specs/ is the main source of truth for implementation.
- After each implementation, check the boxes in the markdown file docs/specs/backlogs.md and mark done for tasks that are implemented.