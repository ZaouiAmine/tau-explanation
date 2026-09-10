# Understanding Tau — A Progressive Course

<div align="center">

**An interactive, progressive course on distributed cloud computing with Tau**

[![Deploy to GitHub Pages](https://github.com/taubyte/tau-course/actions/workflows/deploy.yml/badge.svg)](https://github.com/taubyte/tau-course/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://taubyte.github.io/tau-course/) • [Tau Repository](https://github.com/taubyte/tau) • [Official Docs](https://tau.how)

</div>

---

## 📚 What is This?

This is a **progressive, interactive course** that teaches Tau from the ground up. Unlike traditional documentation that assumes prior knowledge, this course builds understanding layer by layer:

1. **Foundations** — Learn P2P, libp2p, DHTs, CRDTs, WASM, containers, GitOps
2. **Tau Deep Dive** — See how all these technologies come together in Tau
3. **Practical** — Build functions, navigate the codebase, contribute

Each module teaches the prerequisite concepts **before** showing how Tau uses them, so you understand not just *what* Tau does, but *why* it does it.

## 🎯 Course Structure

### Part 1: Foundations (Modules 1-4)
- Module 1: The Problem Tau Solves
- Module 2: Peer-to-Peer Networks
- Module 3: libp2p — The Networking Stack
- Module 4: Distributed Hash Tables

### Part 2: Data & Execution (Modules 5-9)
- Module 5: Content-Addressed Storage
- Module 6: CRDTs — Eventual Consistency
- Module 7: WebAssembly — Sandboxed Execution
- Module 8: Containerization & Isolation
- Module 9: GitOps — Git-Native Infrastructure

### Part 3: Tau Deep Dive (Modules 10-15)
- Module 10: Now Meet Tau — The Big Picture
- Module 11: Services Deep Dive
- Module 12: Security Model
- Module 13: Dream — Local Development
- Module 14: Building on Tau
- Module 15: Codebase Map & Next Steps

## ✨ Features

- 📖 **15 progressive modules** — Each builds on the previous
- 🎨 **30+ interactive Mermaid diagrams** — Zoomable, pannable
- 💡 **Analogies & examples** — Real-world comparisons for complex concepts
- 🎓 **Learning goals & prerequisites** — Clear structure
- ✅ **Self-assessment questions** — Check your understanding
- 🔍 **Code examples** — Real code with syntax highlighting
- 📊 **Comparison tables** — Technology trade-offs explained
- 🎯 **Progress tracking** — Visual progress bar
- 📱 **Responsive design** — Works on desktop and mobile

## 🚀 Quick Start

### View Online
Visit the [live course](https://taubyte.github.io/tau-course/) (after deployment).

### Run Locally

```bash
# Clone the repository
git clone https://github.com/taubyte/tau-course.git
cd tau-course

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **Mermaid** — Interactive diagrams

## 📦 Deployment

### Automatic Deployment (GitHub Actions)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

**To enable:**
1. Go to your repository settings
2. Navigate to **Pages** in the sidebar
3. Under **Source**, select **GitHub Actions**
4. Push to `main` — the workflow will build and deploy automatically

Your site will be available at: `https://<username>.github.io/<repository-name>/`

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the static site
# Upload it to your hosting provider or GitHub Pages
```

### Custom Domain

If you want to use a custom domain:

1. Create a `CNAME` file in the `public/` folder with your domain:
   ```
   course.tau.how
   ```

2. Update your DNS records to point to GitHub Pages

3. The workflow will automatically include the CNAME file in the deployment

## 🎓 Learning Path

### For Beginners
Start at Module 1 and progress sequentially. Each module has prerequisites listed at the top.

### For Experienced Developers
Jump directly to Module 10 (Now Meet Tau) if you're already familiar with P2P, DHTs, CRDTs, and WASM.

### For Contributors
Module 15 (Codebase Map) provides a complete guide to navigating the Tau repository.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Content Improvements
- Fix typos or clarify explanations
- Add more analogies or examples
- Improve diagram clarity

### New Modules
- Add advanced topics (e.g., performance tuning, scaling strategies)
- Create specialized tracks (e.g., "Security Deep Dive", "Building Custom Services")

### Technical Improvements
- Enhance diagram interactivity
- Add search functionality
- Improve mobile experience

**To contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-module`)
3. Commit your changes (`git commit -m 'Add amazing module'`)
4. Push to the branch (`git push origin feature/amazing-module`)
5. Open a Pull Request

## 📖 Related Resources

- [Tau Repository](https://github.com/taubyte/tau) — The main Tau project
- [Official Documentation](https://tau.how) — Tau's official docs
- [Tau Discord](https://discord.gg/KbN3KN7kpQ) — Community chat
- [Tau Blog](https://taubyte.com/blog) — Latest updates and tutorials

## 📝 License

This course is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with knowledge from the [Tau repository](https://github.com/taubyte/tau)
- Diagrams powered by [Mermaid](https://mermaid.js.org/)
- UI built with [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

- **Tau Community**: [Discord](https://discord.gg/KbN3KN7kpQ)
- **Issues**: [GitHub Issues](https://github.com/taubyte/tau-course/issues)

---

<div align="center">

**Built with the understanding that great documentation doesn't just explain *what* — it teaches *why* and *how*.**

[Star this repo](https://github.com/taubyte/tau-course) if you find it helpful! ⭐

</div>
