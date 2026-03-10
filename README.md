# Yellow Pages - LinkedIn Network Mapping

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)] [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)] [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)] [![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=FF9900)]

## 🎯 Project Overview
**Yellow Pages** is a web application that helps **VC firms** discover professional networks by mapping organizational LinkedIn connections. Users can search for companies and instantly see key employees, their connections and network overlap.

**My main contributions:**
- ✅ **Backend development** - Django REST API
- ✅ **Database design** - PostgreSQL schema for 100K+ LinkedIn profiles
- ✅ **DevOps** - Dockerized deployment on AWS with Terraform IaC
- ✅ **Performance** - Optimized search queries

**Tech Stack:** Django • React • PostgreSQL • Docker • AWS • Terraform

---

## 🚀 Features
- 📊 Network overlap visualization between companies
- 👥 Employee profile discovery with connection strength
- ⚙️ Admin dashboard for data management
- 📈 Scalable architecture (100K+ profiles)

## 🛠️ Admin Setup

### Initial Setup
1. Install Docker Desktop + VS Code plugin
2. Clone project: `git clone <repo>`
3. `cd digital-media/linkedin_network`
4. Run: `docker compose --env-file .env.dev up -d --build`
5. Attach to web container shell via Docker plugin
6. `python manage.py createsuperuser`
7. Visit: `http://localhost:8000/admin`

**Quick restart:** `docker compose up`
**Shutdown:** `docker compose down`

---

## 📁 Folder Structure
 - Frontend
|
 - Backend - Linkedin_network
