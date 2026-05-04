# Skill Installation & Teaching Lesson

## 📦 How to Install a New Skill from GitHub

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-organization/skill-name.git
   ```

2. **Verify Installation**:
   Check if the skill directory exists:
   ```bash
   ls skill-name
   ```

3. **Load the Skill**:
   Use the `skill-creator` command:
   ```bash
   skill-creator load skill-name
   ```

4. **Test the Skill**:
   ```bash
   skill-creator test
   ```

## 💡 Teaching the Lesson

- **Share steps** via `sessions_send` to your user:
  ```bash
  sessions_send -m "Here's how to install a skill: [link]" -s your-session-key
  ```

- **Save for later**:
  Store this lesson in `~/neuro-daily/` for future reference.

> *Note: Replace `your-organization` with your GitHub repo owner. This lesson follows OpenClaw's skill-creation workflow.*