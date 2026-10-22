# 🏥 Hospital Appointment System – DevOps Project

A **full-stack Hospital Appointment web application** deployed using **Docker, GitHub Actions (CI/CD), AWS EC2, Nginx, and MongoDB Atlas**.

This project demonstrates **real-world DevOps practices** including containerization, automated deployment, environment management, and production debugging.

---

## 🚀 Live Application

```
http://100.26.51.136/

---

## 🧭 System Architecture (Diagram)

```
┌──────────────┐
│   User       │
│   Browser    │
└──────┬───────┘
       │ HTTP Request
       ▼
┌──────────────┐
│   Nginx      │
│  (Port 80)   │
│  Reverse     │
│   Proxy      │
└──────┬───────┘
       │ Forward request
       ▼
┌──────────────┐
│   Docker     │
│  Container   │
│ Node.js App  │
│ (Port 3000)  │
└──────┬───────┘
       │ Database Query
       ▼
┌──────────────┐
│ MongoDB      │
│ Atlas (Cloud)│
└──────────────┘
```

---

## 🛠️ Tech Stack

### 🔹 Backend

* Node.js
* Express.js
* EJS (templating)
* MongoDB (Atlas)
* Mongoose

### 🔹 DevOps & Cloud

* Docker
* GitHub Actions (CI/CD)
* AWS EC2 (Amazon Linux)
* Nginx (Reverse Proxy)
* SSH (Key-based authentication)

---

## 🐳 Docker – What It Does (Diagram)

Docker **packages the application with all dependencies** into a container so it runs the same everywhere.

```
┌──────────────────────────────┐
│ Docker Image                 │
│ ─────────────────────────── │
│ • Node.js Runtime            │
│ • App Source Code            │
│ • npm Dependencies           │
│ • Start Command              │
└──────────────┬──────────────┘
               │ docker run
               ▼
┌──────────────────────────────┐
│ Docker Container (Running)   │
│ • Isolated Environment       │
│ • App runs on Port 3000      │
└──────────────────────────────┘
```

### Why Docker?

* No “works on my machine” issues
* Easy rebuild & redeploy
* Perfect for CI/CD
* Lightweight compared to VMs

---

## ☁️ AWS EC2 – Role in the Project

EC2 acts as the **production server**.

```
┌──────────────────────────────┐
│ AWS EC2 Instance             │
│ ─────────────────────────── │
│ • Amazon Linux OS            │
│ • Docker Engine              │
│ • Nginx Server               │
│ • hospital.env (secrets)     │
└──────────────────────────────┘
```

### EC2 Responsibilities

* Hosts Docker containers
* Exposes public IP
* Runs Nginx
* Receives deployments from CI/CD
* Stores environment variables securely

---

## 🔄 CI/CD Pipeline (Diagram)

```
┌──────────────┐
│ Developer    │
│ git push     │
└──────┬───────┘
       ▼
┌──────────────┐
│ GitHub Repo  │
│ (main)       │
└──────┬───────┘
       ▼
┌──────────────┐
│ GitHub       │
│ Actions      │
│ CI/CD        │
└──────┬───────┘
       │ SSH
       ▼
┌──────────────┐
│ AWS EC2      │
│ ───────────  │
│ docker build │
│ docker run   │
└──────────────┘
```

### CI/CD Automatically:

* Triggers on every push to `main`
* SSHs into EC2
* Builds a fresh Docker image
* Stops old container
* Runs new container

---

## 🔐 Environment & Secrets Handling (Diagram)

Secrets are **never stored in GitHub or Docker images**.

```
┌──────────────────────────────┐
│ /home/ec2-user/hospital.env  │
│ ─────────────────────────── │
│ MONGODB_URI=...              │
│ SESSION_SECRET=...           │
│ PORT=3000                    │
└──────────────┬──────────────┘
               │ --env-file
               ▼
┌──────────────────────────────┐
│ Docker Container             │
│ Reads env securely           │
└──────────────────────────────┘
```

✔ Secure
✔ Production-ready
✔ No secret leaks

---

## 📂 Project Structure

```
hospital-appointment/
├── .github/workflows/
│   └── deploy.yml
├── views/
│   └── partials/
│       └── footer.ejs
├── public/
├── routes/
├── models/
├── Dockerfile
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Deployment Logic (High-Level)

```
docker stop hospital-app
docker rm hospital-app
docker build -t hospital-app .
docker run -d --env-file hospital.env -p 3000:3000 hospital-app
```

This ensures:

* No stale UI
* No container conflict
* Clean deployment every time

---

## 🧠 DevOps Concepts Demonstrated

* Docker vs VM
* CI/CD automation
* Reverse proxy (Nginx)
* Secure secret management
* Cloud deployment (AWS EC2)
* Production debugging

---

## 🧯 Real Issues Solved

* 502 Bad Gateway
* Docker container conflicts
* Missing environment variables
* Multiple CI workflows collision
* Stale Docker images

✔ Fixed using **real production debugging**, not theory

---

## 👨‍💻 Author

**Aman Kumar**
Hospital Appointment DevOps Project

---

## 📌 Why This Project Matters

This project proves:

* Real DevOps skills
* End-to-end deployment knowledge
* Cloud + Docker + CI/CD integration
* Production troubleshooting experience

