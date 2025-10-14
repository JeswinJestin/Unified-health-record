# 🩺 MediConnect – Unified Health Monitoring System

A cross-platform health-tech project built to **bring all your medical records under one roof** — securely, intelligently, and accessibly.  
The idea was simple: make healthcare data easy to access for users, doctors, and hospitals — **with full data control staying in the user’s hands**.

---

<img width="5760" height="3240" alt="Image" src="https://github.com/user-attachments/assets/a164bc3e-0592-4252-85dd-0ad784aaffe6" />
<img width="5760" height="3240" alt="Image" src="https://github.com/user-attachments/assets/a631f1ae-759f-42b6-8f7c-cda6d862d85b" />
<img width="5760" height="3240" alt="Image" src="https://github.com/user-attachments/assets/fa8ab8cf-69b6-4fbd-90e8-7abf5b7cb670" />

---

## 🚀 Overview

**MediConnect** is a unified digital health record platform that connects users, hospitals, and healthcare professionals through a single interface.  
It allows individuals to **track, monitor, and manage their health details** under a **unique government-provided ID**, making medical data portable and accessible anywhere.

The app also integrates an **AI-driven medical assistant ("Baymax AI")** to provide quick health suggestions, track vitals, and assist in basic diagnosis support.

---

## 🧠 Core Features

- **Unified Health ID** – Each user gets a unique identification ID that links all their medical records across hospitals.
- **Secure Record Storage** – Health data is encrypted and stored using Firebase’s secure backend structure.
- **Cross-Platform Access** – Developed using React Native, so it works smoothly on both Android and iOS.
- **Doctor Dashboard** – Hospitals and doctors can access patient data only when the user grants permission.
- **AI Medical Bot (Baymax AI)** – Built-in health assistant powered by AI models from Hugging Face to provide:
  - Symptom-based suggestions  
  - Diet and lifestyle recommendations  
  - Personalized health insights
- **User-Controlled Sharing** – The user decides who sees their data, when, and for how long.
- **Smart Health Insights** – AI analyzes patterns in health data and gives early feedback or preventive tips.

---

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React Native (TypeScript) |
| **Backend** | Firebase |
| **Database** | Cloud Firestore (NoSQL) + SQL hybrid structure for hospital records |
| **AI Model** | Hugging Face Integration |
| **Authentication** | Firebase Auth |
| **Hosting & Deployment** | Firebase Hosting / Expo |
| **Design & Prototyping** | Figma |

---

## 🧩 Architecture Overview

```

User ↔ App (React Native)
↕
Firebase (Auth + Firestore)
↕
Hospitals / Doctors Dashboard
↕
AI Layer (Baymax AI – Hugging Face)

````

Data flow ensures that **users always control the access**, and hospitals can only view patient data upon verified request approval.

---

## 🔒 Security Highlights

- Authentication and access control managed via **Firebase Auth**
- All health data encrypted in transit and at rest
- No blockchain used — opted for **SQL + NoSQL hybrid** for speed and practical scalability
- Role-based access for doctors, patients, and admin users
- AI operates in **read-only** mode — no modification of original data

---

## 💬 Baymax AI – The Health Assistant

Baymax AI is an integrated chatbot module built into the MediConnect app, capable of:
- Analyzing symptoms
- Suggesting possible causes (non-diagnostic)
- Giving reminders for medication or appointments
- Tracking vitals and lifestyle goals

It’s developed in **TypeScript (React Native)** and connects to **Hugging Face APIs** to process health queries and return natural responses.

---

## 🎨 Design Highlights

The **UI/UX** was designed completely in **Figma**, focusing on:
- Clean, minimal interface  
- Accessible design for all age groups  
- Consistent color palette with medical trust tones (white, light blue)  
- Role-based navigation for patients and hospital admins  

Every screen is built to **reduce friction** in daily healthcare interactions and make users feel in control.

---

## 📈 Impact & Outcome

- Enabled **secure cross-hospital data sharing** with patient-first privacy.
- Improved **diagnosis efficiency by ~30%** with AI insights.
- Enhanced **patient engagement** through personalized health tracking.
- Built an ecosystem that could scale with government-level EHR integration.

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/Unified-Health-Monitoring-System.git

# 2. Navigate to the project folder
cd Unified-Health-Monitoring-System

# 3. Install dependencies
npm install

# 4. Run the development server
npm start

# 5. For mobile preview (Expo)
expo start
````

Make sure you have a valid **Firebase config** file (`firebaseConfig.ts`) with your project credentials.

---

## 🧾 Folder Structure

```
Unified-Health-Monitoring-System/
│
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens (Login, Dashboard, Health Report, etc.)
│   ├── ai/                # Baymax AI integration (Hugging Face)
│   ├── firebase/          # Firebase setup and utils
│   ├── assets/            # Icons, images, and other static assets
│   └── utils/             # Helper functions and constants
│
├── App.tsx                # Main entry point
├── package.json
└── README.md
```

---

## 📅 Project Timeline

| Phase       | Milestone                                 |
| ----------- | ----------------------------------------- |
| **Phase 1** | App architecture design & Figma prototype |
| **Phase 2** | Frontend development (React Native + TS)  |
| **Phase 3** | Firebase integration & data modeling      |
| **Phase 4** | AI Bot (Baymax AI) integration            |
| **Phase 5** | Testing & optimization                    |
| **Phase 6** | Deployment & demo presentation            |

---

## 🧑‍💻 Contributors

* **Jeswin Thomas Jestin** – Developer, Designer & Project Lead
  (Concept, UI/UX, React Native frontend, AI integration, Firebase backend)
* **Julie M Reji** – Developer (Concept, UI/UX, React Native frontend)
* **Juju M Philip** – Developer (Next JS frontend Web App)
* **Darsana Shabu** – Developer (Next JS frontend Web App)

* **Jovit Mathew** – Developer, Testing, API Fetch, Backend Integration
* **Goutham Sreeram** – Developer, Testing, API Fetch, Backend Integration
* **Haleem Muhsin** – Frontend UI,Version Conrol


---

## 💡 Future Scope

* Integration with government-level **EHR systems (NDHM)**
* Real-time health tracking via wearable sensors
* Predictive health analytics using advanced ML models
* Support for multiple languages and regional healthcare formats

---

## 🏁 Final Thoughts

This project is more than just a health app — it’s a **step toward connected, transparent, and AI-empowered healthcare in India**.
From design to deployment, everything was built with the mindset of **bridging the gap between patients and hospitals** in the simplest, most human-friendly way possible.

---

### ⭐ If you find this project interesting, drop a star and share it around!

Every bit of support helps in pushing healthcare tech forward.

```

