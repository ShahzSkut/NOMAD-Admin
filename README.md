# NOMAD — Admin Portal & Analytics Dashboard

**Nomad Admin Portal** is the centralized administrative web dashboard for managing the Nomad Intelligent Travel Planner system. Built for seamless data control and monitoring, it provides real-time visualization of platform metrics, user trip analytics, and user role management backed directly by Supabase.

---

## ✨ Key Features

- **Analytics Overview Panel:** Visualizes key performance metrics including activity counts, average trip duration, and total travel expenditure (RM).
- **Trip Purpose Distribution:** Interactive doughnut chart breaking down travel motivations (Sightseeing, Food Hunting, Family Vacations, and Education/Study Tours).
- **User Growth Tracker:** Real-time user registration trends and monthly growth distribution charts.
- **Management Table:** Centralized user management with live email searching, role assignment (Admin / Traveler), and account editing or removal capabilities.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Modern CSS / Tailwind CSS, JavaScript (ES6+)
- **Charts & Visualizations:** Chart.js / Recharts
- **Database & Auth:** Supabase (PostgreSQL Cloud Backend & Row Level Security)
- **Deployment:** Vercel / Netlify

---

## 🚀 Environment Setup & Configuration

To connect this admin dashboard to your Supabase instance, set up your configuration file in the project root directory.

### 1. Create a `.env` File
In the root directory of the project, create a `.env` file:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Obtain Supabase Credentials

1. Log in to your [Supabase Dashboard](https://supabase.com/).
2. Select your Nomad project.
3. Navigate to **Project Settings** $\rightarrow$ **API**.
4. Copy your **Project URL** (`SUPABASE_URL`) and **anon/public Key** (`SUPABASE_ANON_KEY`).

## Dashboard Previews
<img width="1920" height="1080" alt="Nomad — Mozilla Firefox 27_10_2026 7_49_35 PM" src="https://github.com/user-attachments/assets/45acfe6a-77ea-4669-876b-b1d694d39a77" />
<img width="1920" height="1080" alt="Nomad — Mozilla Firefox 27_10_2026 7_49_24 PM" src="https://github.com/user-attachments/assets/acff8c14-08b7-4146-bc9f-b6d9042bc777" />



# React + Vite

Nomad Project Structure

src/
├── api/     
├── components/
├── pages/   
├── context/
├── App.jsx     
└── index.jsx
