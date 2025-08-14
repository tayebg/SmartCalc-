# SmartCalc+ 🧮✨

A modern, responsive web application for LMD students in Algeria, primarily designed for USTO-MB University (Département d'Informatique), but useful for all Computer Science students.

## ✨ Features

### 🎯 Core Functionality
- **GPA Calculator**: Complete semester and annual GPA calculation
- **LMD Structure**: Support for Licence (L1, L2, L3), Master (M1, M2), and Doctorat levels
- **Specializations**: ISIL, SI, IA, SID, RSID specializations
- **Module Management**: Pre-configured modules for each level
- **PDF Export**: Export calculations and results
- **Annual Calculations**: Combined semester average calculations

### 🎨 Modern UI/UX
- **Gradient Design**: Beautiful #6366F1 → #9333EA gradient theme
- **Glassmorphism**: Modern glass effects in dark mode
- **Framer Motion**: Smooth animations and micro-interactions
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Mode**: Complete theme switching
- **Ripple Effects**: Interactive button animations

### 📱 PWA Features
- **Progressive Web App**: Full PWA implementation
- **Offline Support**: Works without internet connection
- **Service Worker**: Background sync and caching
- **App Installation**: Can be installed on devices

### 🔧 Technical Stack
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **Radix UI** components
- **Supabase** integration ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd smartcalc-plus

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── calculator/          # GPA calculation components
│   ├── layout/             # Navigation, footer, etc.
│   └── ui/                 # Reusable UI components
├── data/                   # Module data for each level
├── logic/                  # Calculation algorithms
├── pages/                  # Main application pages
└── hooks/                  # Custom React hooks
```

## 🎓 Supported Levels

### Licence
- **L1**: Foundation year modules
- **L2**: Second year modules  
- **L3 ISIL**: Software Engineering specialization
- **L3 SI**: Information Systems specialization

### Master
- **M1 IA**: Artificial Intelligence
- **M1 SID**: Information Security
- **M1 RSID**: Networks and Information Security
- **M2**: Advanced master modules

### Doctorat
- Doctoral program support (coming soon)

## 🧮 Calculation Features

### Semester GPA
- Module-by-module grade input
- Unit-based calculation (UEF, UEM, UED, UET)
- Credit-weighted averages
- Validation status (>= 10/20)
- Real-time progress tracking

### Annual GPA
- Combine two semesters
- Credit-weighted annual average
- Formula: `((S1_Avg × S1_Credits) + (S2_Avg × S2_Credits)) / Total_Credits`

### Export Options
- Text file export with detailed results
- PDF export capability
- Formatted calculation summaries

## 🌟 Key Pages

- **Home**: Landing page with features overview
- **Calculations**: Main GPA calculation interface
- **Drives**: Google Drive links for study materials
- **Canevas**: Downloadable PDF templates
- **Videos**: Educational video playlists
- **Contact**: Developer contact information

## 👥 Target Audience

> **Primary**: LMD students at USTO-MB University (Département d'Informatique)
> 
> **Secondary**: All Computer Science students in Algerian universities using the LMD system

## 📖 Calculation Methods

### Unit Average (Moyenne d'Unité)
Weighted average of all modules in a unit based on credits.

### Semester Average (Moyenne Semestrielle)  
Weighted average of all units based on total unit credits.

### Annual Average (Moyenne Annuelle)
Combined average of two semesters weighted by their respective credits.

### Credit Rules (Règles des Crédits)
- L1/L2/L3: 30 credits per semester
- M1/M2: 30 credits per semester
- Minimum 10/20 required for validation

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy with HTTPS enabled

### Performance Targets
- **Lighthouse Performance**: ≥90
- **SEO Score**: ≥90
- **PWA Score**: ≥90

## 🤝 Contributing

This project is primarily designed for USTO-MB students but welcomes contributions from the broader academic community.

## 📞 Contact

**Developer**: Bekkouche Tayeb & Bakkar Ilyes

- **Email**: tayebekk2004@gmail.com
- **LinkedIn**: [Tayeb Bekkouche](https://www.linkedin.com/in/tayebbekkouche)
- **GitHub**: [tayebg](https://github.com/tayebg)

## 📜 License

This project is developed for educational purposes and the benefit of Algerian LMD students.

---

**Made with ❤️ by Bekkouche Tayeb & Bakkar Ilyes | 2025**
