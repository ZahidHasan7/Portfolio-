import React, { useState, useEffect, useRef } from "react";

import profileImg from "./assets/profile.jpg";

import Asif from "./assets/Asif.jpg";

import Sharif from "./assets/Sharif.jpg";
import connect from "./assets/connect.png";
import MessEaseImg from "./assets/MessEase.webp";
import PsycareImg from "./assets/PhyCare.webp";

import AIShomachar from "./assets/AI-Shomachar.webp";
import BookRecomendation from "./assets/BookRecomendation (1).webp";
import NovaMindXRImg from "./assets/NovaMindXR.png";
import contexify from "./assets/contexify.png";
import RoadGuardianAIImg from "./assets/RoadGardianAI.png";
import EcommerceImg from "./assets/Ecommerce.jpg";
import InnerseedImg from "./assets/Innerseed.jpg";
import CricketGameImg from "./assets/cricketgame.png";
import BanglaSpeechAIImg from "./assets/BanglaSpeechAI.png";
// --- Gemini API Helper Function ---
// A utility to call the Gemini API.
// NOTE: The API key is intentionally left as an empty string.
// The execution environment will automatically handle authentication.
async function callGemini(prompt, systemInstruction) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const payload = {
    model: "llama-3.3-70b-versatile",
    messages: messages,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error Detailed:", errorBody);
      const msg = errorBody.error?.message || response.statusText;
      return `Error: ${msg}`;
    }

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content;

    if (reply) {
      return reply;
    } else {
      return "Sorry, I couldn't generate a response. Please try again.";
    }
  } catch (error) {
    console.error("Network or other error:", error);
    return "An error occurred while contacting the AI. Please check the console.";
  }
}

// Since we can't use feather-icons package directly in this environment,
// we'll create simple SVG icons for replacement.
const FeatherIcon = ({ name, className }) => {
  const icons = {
    menu: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    ),
    github: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
    linkedin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    mail: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    ),
    externalLink: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    ),
  };

  return icons[name] || null;
};

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#work-experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Kind Words" },
  { href: "#artifacts", label: "Artifacts" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#hero" className="text-2xl font-bold text-white">
          Zahid<span className="text-[var(--primary-color)]">.</span>
        </a>
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-gray-300 hover:text-[var(--primary-color)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          id="mobile-menu-button"
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FeatherIcon name="menu" />
        </button>
      </div>
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden px-6 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-300 hover:text-[var(--primary-color)]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const floatingContainerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const floatingContainer = floatingContainerRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let floatingElements = [];
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let animationFrameId;

    const CodeSymbols = [
      "{ }",
      "< />",
      "( )",
      "[ ]",
      "=>",
      "===",
      "!==",
      "==",
      "!=",
      ">=",
      "<=",
      "?:",
      "??",
      "|",
      "&",
      "^",
      "~",
      "<<",
      ">>",
      "::",
      "=>",
      "<>",
      "&&",
      "||",
      "fn",
      "var",
      "let",
      "const",
      "class",
      "import",
      "export",
      "async",
      "await",
      "return",
      "if",
      "else",
      "for",
      "while",
      "OOP",
      "Functional",
      "Array",
      "Stack",
      "Queue",
      "Tree",
      "Graph",
      "HashMap",
      "Recursion",
      "DP",
      "Greedy",
      "DFS",
      "BFS",
      "Binary Search",
      "AWS",
      "REST",
      "GraphQL",
      "API",
      "Callback",
      "case",
      "break",
      "continue",
      "try",
      "catch",
      "finally",
      "throw",
      "new",
      "this",
      "super",
      "extends",
      "implements",
      "interface",
      "public",
      "private",
      "protected",
      "static",
      "Algorithm",
      "Bug",
      "Debug",
      "Deploy",
      "Build",
      "Test",
      "SQL",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "NPM",
      "Yarn",
      "Vite",
      "Webpack",
      "Firebase",

      "React",
      "Vue",
      "Angular",
      "Node",
      "Git",
      "Docker",
    ];

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initAnimation = () => {
      if (!canvas || !floatingContainer) return;
      resizeCanvas();
      particles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.6 + 0.3,
        color: ["#c084fc", "#22d3ee", "#d1d5db", "#f9fafb"][
          Math.floor(Math.random() * 4)
        ],
      }));

      while (floatingContainer.firstChild) {
        floatingContainer.removeChild(floatingContainer.firstChild);
      }

      floatingElements = Array.from({ length: 12 }, (_, i) => {
        const element = document.createElement("div");
        element.className =
          "absolute font-mono text-sm font-bold pointer-events-none select-none";
        const vibrantColors = [
          "#E53E3E",
          "#F6E05E",
          "#E34234",
          "#007FFF",
          "#ED8936",
          "#FF69B4",
          "#FFBF00",
          "#FA8072",
          "#D53F8C",
        ];
        const color =
          vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
        const size = Math.random() * 20 + 15;
        element.innerText =
          CodeSymbols[Math.floor(Math.random() * CodeSymbols.length)];
        element.style.color = color;
        element.style.fontSize = `${size}px`;
        element.style.textShadow = `0 0 20px ${color}40, 0 0 40px ${color}20`;
        floatingContainer.appendChild(element);

        return {
          id: i,
          domElement: element,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          drift: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
          },
        };
      });
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = (100 - distance) / 100;
          p.vx -= (dx / distance) * force * 0.3;
          p.vy -= (dy / distance) * force * 0.3;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.vx *= 0.995;
        p.vy *= 0.995;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      });

      ctx.strokeStyle = `rgba(8, 145, 178, 0.3)`;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            const opacity = 1 - distance / 150;
            ctx.globalAlpha = opacity * 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      floatingElements.forEach((el) => {
        el.x += el.drift.x;
        el.y += el.drift.y;
        el.rotation += el.rotationSpeed;
        if (el.x < -50) el.x = canvas.width + 50;
        if (el.x > canvas.width + 50) el.x = -50;
        if (el.y < -50) el.y = canvas.height + 50;
        if (el.y > canvas.height + 50) el.y = -50;
        el.domElement.style.opacity = el.opacity;
        el.domElement.style.transform = `translate(${el.x}px, ${el.y}px) rotate(${el.rotation}deg)`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initAnimation();
    animate();

    const handleResize = () => resizeCanvas();
    const handleMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (floatingContainerRef.current) {
        while (floatingContainerRef.current.firstChild) {
          floatingContainerRef.current.removeChild(
            floatingContainerRef.current.firstChild,
          );
        }
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      ></canvas>
      <div
        ref={floatingContainerRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      ></div>
    </>
  );
};

const Hero = () => {
  const [typingText, setTypingText] = useState("");
  const roles = [
    "Software Engineer",
    "Full-Stack · React Native · NLP · Speech AI",
    "Researcher & Problem Solver",
  ];

  useEffect(() => {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
      const currentRole = roles[roleIndex];
      let text;
      if (isDeleting) {
        text = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        text = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }
      setTypingText(text);

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        timeout = setTimeout(type, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = setTimeout(type, 500);
      } else {
        const typeSpeed = isDeleting ? 100 : 150;
        timeout = setTimeout(type, typeSpeed);
      }
    }

    type();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 md:pt-0 relative"
    >
      <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div className="text-center md:text-left">
          <p className="text-cyan-400 text-lg mb-2">I am</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            M. M. Zahid Hasan
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 mt-3">
            And I'm a{" "}
            <span id="typing-text" className="text-purple-400">
              {typingText}
            </span>
          </h2>
          <p className="text-gray-300 mt-6 max-w-lg mx-auto md:mx-0">
            Software engineer, researcher, and problem solver building
            full-stack web and mobile experiences, speech AI systems, and NLP
            research solutions for real-world impact.
          </p>
          <div className="flex flex-col items-center justify-center md:items-start gap-6 mt-8">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ZahidHasan7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 hover:text-purple-400 transition-colors"
              >
                <FeatherIcon name="github" className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/zahid-hasan-0175b7238"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 hover:text-purple-400 transition-colors"
              >
                <FeatherIcon name="linkedin" className="w-6 h-6" />
              </a>
              <a
                href="mailto:m.m.zahidhasan7@gmail.com"
                className="w-12 h-12 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 hover:text-purple-400 transition-colors"
              >
                <FeatherIcon name="mail" className="w-6 h-6" />
              </a>
            </div>
            <a
              href="/resume.pdf"
              download="M._M._Zahid_Hasan_resume.pdf"
              className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-lg"
            >
              Download CV
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src={profileImg}
            alt="Zahid Hasan"
            className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-8 border-cyan-800/50 shadow-2xl shadow-cyan-700/30 ml-4"
          />
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-24">
    <div className="text-center mb-12">
      <p className="text-sm text-[var(--primary-color)] bg-[var(--card-bg)]/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full mb-2">
        About Me
      </p>
      <h2 className="text-4xl font-bold text-white">Who I Am</h2>
    </div>
    <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-md p-8 rounded-lg space-y-6">
      <p className="text-gray-300 leading-relaxed text-xl">
        I'm M. M. Zahid Hasan — a software engineer, researcher, and problem
        solver based in Bangladesh. I'm currently pursuing my B.Sc. in Software
        Engineering at Shahjalal University of Science and Technology (SUST),
        where I've been building both technical depth and real-world experience
        since 2022.
      </p>
      <p className="text-gray-300 leading-relaxed text-xl">
        On the engineering side, I work as a Software Engineer Intern at
        ShellBeeHaken Ltd. in Dhaka, where I develop full-stack web applications
        (React.js, Next.js, Node.js) and mobile apps (React Native), integrate
        RESTful APIs, and contribute to AI/speech R&D — including a Bangla
        TTS/STT pipeline built for real-world call-center applications.
      </p>
      <p className="text-gray-300 leading-relaxed text-xl">
        On the research side, my undergraduate thesis explores LLM-based
        Text-to-SQL generation using a Structured Chain-of-Thought (SCoT)
        prompting approach, achieving 84.33% accuracy on the Spider benchmark —
        one of the most competitive NL-to-SQL evaluation datasets.
      </p>
      <p className="text-gray-300 leading-relaxed text-xl">
        My core interests lie in NLP, Speech Processing, LLMs, and Prompt
        Engineering — areas where I believe software and AI can have the most
        meaningful real-world impact.
      </p>
    </div>
  </section>
);

const educationData = [
  {
    degree: "B.Sc. in Software Engineering (IICT)",
    institution:
      "Shahjalal University of Science and Technology (SUST), Sylhet",
    duration: "March 2022 – Present",
    details: [
      "Undergraduate thesis: LLM-Based Text-to-SQL Generation using Structured Chain-of-Thought (SCoT) Prompting",
      "84.33% accuracy on the Spider benchmark",
      "Supervisor: Fazle Rabbi Rakib, SUST",
    ],
  },
  {
    degree: "Higher Secondary Certificate",
    institution: "Government Science College, Tejgaon, Dhaka",
    duration: "July 2018 – June 2020",
  },
];

const Education = () => (
  <section id="education" className="py-24">
    <h2 className="text-4xl font-bold text-center text-white mb-12">
      Education
    </h2>
    <div className="max-w-3xl mx-auto">
      <div className="relative border-l-2 border-cyan-700/50 pl-10 space-y-12">
        {educationData.map((edu, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-[var(--card-bg)]/80 rounded-full border-4 border-cyan-500"></div>
            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
            <p className="text-cyan-400 font-semibold mb-1">
              {edu.institution}
            </p>
            <p className="text-gray-400 text-sm">{edu.duration}</p>
            {edu.details && (
              <ul className="mt-3 text-gray-300 text-sm space-y-2 list-disc list-inside">
                {edu.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const experienceData = [
  {
    role: "Software Engineer Intern",
    company: "ShellBeeHaken Ltd.",
    location: "Dhaka, Bangladesh",
    duration: "December 2025 – Present",
    shortDescription:
      "Building full-stack web and mobile applications while leading Bangla speech AI R&D for production-grade call center and customer service experiences.",
    areas: [
      {
        title: "Full-Stack Development",
        points: [
          "Developed production-grade web applications with React.js, Next.js, Node.js, and Express.js.",
          "Built React Native mobile apps and contributed to company mobile projects using clean architecture.",
          "Integrated RESTful APIs and supported end-to-end feature delivery from UI to backend services.",
          "Performed QA testing for KoritKarmo, identifying and reporting 31 bugs across user, agency, and member portals.",
        ],
      },
      {
        title: "Speech AI & NLP",
        points: [
          "Conducted R&D on a Bangla TTS/STT pipeline using VITS2, Whisper optimization, and code-mixed Banglish processing.",
          "Fine-tuned speech models for Bangla and code-mixed Bangla-English audio using Hugging Face Transformers, torchaudio, and librosa.",
          "Built large-scale conversational ASR datasets for real-world e-commerce and customer service scenarios.",
        ],
      },
    ],
    skills: [
      "Python",
      "React.js",
      "Next.js",
      "React Native",
      "Node.js",
      "Express.js",
      "Hugging Face",
      "PyTorch",
      "torchaudio",
      "librosa",
      "NLP",
      "Speech Processing",
      "Prompt Engineering",
    ],
  },
];

const Experience = () => (
  <section id="work-experience" className="py-24">
    <h2 className="text-4xl font-bold text-center text-white mb-12">
      💼 Experience
    </h2>
    <div className="max-w-4xl mx-auto space-y-8">
      {experienceData.map((exp, index) => (
        <div
          key={index}
          className="bg-[var(--card-bg)]/80 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-cyan-700/50 shadow-2xl shadow-cyan-800/20"
        >
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
              <div>
                <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                <p className="text-cyan-400 font-semibold text-lg">
                  {exp.company}
                </p>
              </div>
              <div className="text-gray-400 text-sm mt-2 md:mt-0 md:text-right">
                <p>{exp.location}</p>
                <p className="font-semibold">{exp.duration}</p>
              </div>
            </div>
            <p className="text-gray-300 italic mt-4 p-4 bg-cyan-900/20 rounded-lg border border-cyan-700/30">
              "{exp.shortDescription}"
            </p>
          </div>

          <div className="space-y-6 mb-6">
            {exp.areas.map((area, areaIndex) => (
              <div key={areaIndex}>
                <h4 className="text-lg font-bold text-cyan-300 mb-3">
                  {area.title}
                </h4>
                <ul className="space-y-2 ml-4">
                  {area.points.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="text-gray-300 flex items-start"
                    >
                      <span className="text-cyan-400 mr-3 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-cyan-700/30">
            <p className="text-gray-400 text-sm mb-3">Technologies & Skills:</p>
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-3 py-1 bg-cyan-900/30 border border-cyan-600/50 rounded-full text-sm text-cyan-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const skillsData = [
  {
    name: "Three.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
  },
  {
    name: "React Three Fiber",
    icon: "https://cdn.simpleicons.org/threedotjs/ffffff",
  },
  {
    name: "WebGL",
    icon: "https://cdn.simpleicons.org/webgl/990000",
  },
  {
    name: "WebXR",
    icon: "https://cdn.simpleicons.org/meta/0081FB",
  },
  {
    name: "Recharts",
    icon: "https://cdn.simpleicons.org/chartdotjs/FF6384",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    name: "SQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg",
  },
  {
    name: "React.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "React Native",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Expo",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/expo/expo-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "PyTorch",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    name: "TensorFlow",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Scikit-learn",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
  },
  {
    name: "NumPy",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  {
    name: "Pandas",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "Matplotlib",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg",
  },
  {
    name: "Hugging Face",
    icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
  },
  {
    name: "torchaudio",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    name: "librosa",
    icon: "https://raw.githubusercontent.com/librosa/librosa/main/docs/img/librosa_logo_text.svg",
  },
  {
    name: "Redux Toolkit",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  },
  {
    name: "Zustand",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
  },
  {
    name: "Context API",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Postman",
    icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
  },
  {
    name: "Vercel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },
  {
    name: "Render",
    icon: "https://cdn.simpleicons.org/render/46E3B7",
  },
  {
    name: "Google Colab",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg",
  },
  {
    name: "Kaggle",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg",
  },
  {
    name: "Jupyter",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  },
  {
    name: "LaTeX",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg",
  },
];

const Skills = () => (
  <section id="skills" className="py-24">
    <div className="text-center mb-12">
      <p className="text-sm text-[var(--primary-color)] bg-[var(--card-bg)]/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full mb-2">
        ▼ What I Bring to the Table
      </p>
      <h2 className="text-4xl font-bold text-white">My Key Skills</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {skillsData.map((skill) => (
        <div
          key={skill.name}
          className="bg-[var(--card-bg)]/80 backdrop-blur-md border border-cyan-800/50 rounded-lg p-6 text-center transition-all duration-300 hover:bg-cyan-900/40 hover:-translate-y-2 flex flex-col items-center justify-center"
        >
          <img
            src={skill.icon}
            className="h-16 w-16 mx-auto mb-4 object-contain"
            alt={`${skill.name} Icon`}
          />
          <h3 className="font-semibold text-white mt-auto">{skill.name}</h3>
        </div>
      ))}
    </div>
  </section>
);

const projectsData = [
  {
    title: "RoadGuardian AI",
    subtitle: "Autonomous Emergency Intelligence Platform",
    description:
      "AI-native emergency safety and telematics platform with multi-agent AI orchestration, RAG first-aid guidance, and accessibility-first PWA, targeting BIMSTEC regions where 300,000+ lives are lost annually to road accidents.",
    tags: [
      "FastAPI",
      "LangGraph",
      "ChromaDB",
      "React 19",
      "Vite",
      "PWA",
      "WebSockets",
      "Groq",
      "MCP",
      "Leaflet",
    ],
    image: RoadGuardianAIImg,
    frame: "laptop",
    liveLink: "https://road-guardian-chi.vercel.app/",
    githubLink: "https://github.com/ZahidHasan7/RoadGaurdian-AI-",
  },
  {
    title: "NovaMind XR",
    subtitle: "AI-Powered WebXR Educational Platform",
    description:
      "Interactive 3D WebXR platform that diagnoses student science misconceptions, parses natural language via LLMs into structured parameters to procedurally load customized 3D physics environments with an AI Socratic mentor.",
    tags: [
      "Three.js",
      "React Three Fiber",
      "WebGL",
      "WebXR",
      "Recharts",
      "LLM API",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
    image: NovaMindXRImg,
    frame: "laptop",
    liveLink: "",
    githubLink: "https://github.com/shakeraema/NovaMindXR",
  },
  {
    title: "PsyCare",
    subtitle: "Online Mental Healthcare Platform",
    description:
      "A full-stack mental healthcare platform connecting patients with consultants through video calls, AI assistance, and secure payments.",
    tags: [
      "Node.js",
      "Express.js",
      "React.js",
      "MongoDB",
      "JWT",
      "Socket.io",
      "Gemini API",
      "bKash",
      "Tailwind CSS",
    ],
    image: PsycareImg,
    liveLink: "",
    githubLink: "https://github.com/ZahidHasan7/Psycare",
  },
  {
    title: "InnerSeed",
    subtitle: "Intelligent Child Development Platform",
    description:
      "An AI-powered mobile platform that tracks daily parent observations, analyzes emotional and moral development, and delivers personalized insights via generative AI.",
    tags: [
      "React Native",
      "Expo",
      "Node.js",
      "Firebase Firestore",
      "HuggingFace",
      "Google Generative AI",
    ],
    image: InnerseedImg,
    frame: "mobile",
    liveLink: "",
    githubLink: "https://github.com/ZahidHasan7/InnerSeed",
  },
  {
    title: "Bangla TTS & STT Pipeline",
    subtitle: "Speech AI Research System",
    description:
      "An end-to-end Bangla speech processing pipeline with neural TTS, optimized Whisper STT, and code-mixed Banglish support for call center and customer service applications.",
    tags: ["Python", "VITS2", "Whisper", "fastText", "torchaudio", "librosa"],
    image: BanglaSpeechAIImg,
    frame: "laptop",
    liveLink: "",
    githubLink: "https://github.com/ZahidHasan7/R-D",
  },
  {
    title: "MessEase",
    subtitle: "Mess Management System",
    description:
      "A secure multi-tenant web platform for managing hostel meals, expenses, and settlement reports with role-based access and automated billing.",
    tags: [
      "Node.js",
      "Express.js",
      "React.js",
      "MongoDB",
      "JWT",
      "Vercel",
      "Render",
    ],
    image: MessEaseImg,
    liveLink: "https://mess-easy.vercel.app/",
    githubLink:
      "https://github.com/ZahidHasan7/MessEase-A_mess_management_system",
  },
  {
    title: "Contextify",
    subtitle: "AI-Powered Chrome Extension",
    description:
      "A Chrome extension that uses AI to contextually summarize, explain, and interact with web page content. Provides instant AI-generated insights directly in the browser without switching tabs.",
    tags: [
      "JavaScript",
      "Chrome Extension",
      "Manifest V3",
      "Gemini API",
      "HTML",
      "CSS",
    ],
    image: contexify,
    liveLink: "",
    githubLink: "#",
  },
  {
    title: "E-Commerce Mobile Shopping App",
    subtitle: "React Native Shopping Experience",
    description:
      "A production-grade mobile shopping app with Google Sign-In, Cloudinary media management, cart and checkout flows, plus push notification order updates.",
    tags: [
      "React Native",
      "Expo",
      "Firebase",
      "Redux Toolkit",
      "Cloudinary",
      "FlashList",
      "Expo Notifications",
    ],
    image: EcommerceImg,
    frame: "mobile",
    liveLink: "",
    githubLink: "https://github.com/zahidSBH/E-Commerce-App",
  },
  {
    title: "Cricket Match Management System",
    subtitle: "Real-Time Match Tracking",
    description:
      "A full-stack app for managing cricket matches with real-time scoring, multi-provider authentication, and full match lifecycle tracking.",
    tags: [
      "Next.js",
      "NextAuth.js",
      "MongoDB",
      "Mongoose",
      "Google OAuth",
      "bcryptjs",
    ],
    image: CricketGameImg,
    frame: "laptop",
    liveLink: "",
    githubLink: "#",
  },
  {
    title: "Book Recommender System",
    subtitle: "Personalized Reading Suggestions",
    description:
      "A full-stack recommendation app that generates personalized book suggestions using content-based filtering and interactive visualizations.",
    tags: ["Python", "Flask", "Pandas", "Scikit-learn", "NumPy", "Bootstrap"],
    image: BookRecomendation,
    liveLink: "https://book-recommender-system-v20n.onrender.com/",
    githubLink: "https://github.com/ZahidHasan7/Book_Recommender_System.git",
  },
];

const Projects = () => (
  <section id="projects" className="py-24">
    <h2 className="text-4xl font-bold text-center text-white mb-12">
      Latest Works
    </h2>
    <div className="relative max-w-5xl mx-auto">
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-cyan-700/50"></div>
      {projectsData.map((project, index) => (
        <div key={index} className="relative mb-16 flex justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-[var(--card-bg)] z-10"></div>
          <div
            className={`flex items-center w-full max-w-4xl ${index % 2 !== 0 ? "flex-row-reverse" : ""}`}
          >
            <div className="w-1/2 px-8 flex items-center justify-center">
              {project.frame === "mobile" ? (
                /* ── Mobile Phone Frame ── */
                <div className="phone-frame">
                  {/* Side buttons */}
                  <div style={{ position:"absolute", left:"-5px", top:"60px", width:"3px", height:"24px", background:"#334155", borderRadius:"2px" }} />
                  <div style={{ position:"absolute", left:"-5px", top:"92px", width:"3px", height:"36px", background:"#334155", borderRadius:"2px" }} />
                  <div style={{ position:"absolute", right:"-5px", top:"76px", width:"3px", height:"36px", background:"#334155", borderRadius:"2px" }} />
                  {/* Notch */}
                  <div style={{ position:"absolute", top:"10px", left:"50%", transform:"translateX(-50%)", width:"36px", height:"10px", background:"#0f172a", borderRadius:"6px", zIndex:10 }} />
                  {/* Screen */}
                  <div className="phone-screen">
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}
                    />
                  </div>
                  {/* Home indicator */}
                  <div style={{ position:"absolute", bottom:"8px", left:"50%", transform:"translateX(-50%)", width:"40px", height:"3px", background:"#475569", borderRadius:"2px" }} />
                </div>
              ) : project.frame === "laptop" ? (
                /* ── Laptop Frame ── */
                <div className="laptop-frame">
                  {/* Laptop Screen Body */}
                  <div className="laptop-screen-container">
                    <div className="laptop-screen-content">
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                      />
                    </div>
                  </div>
                  {/* Laptop Base */}
                  <div className="laptop-base">
                    {/* Hinge/Indent */}
                    <div className="laptop-hinge" />
                  </div>
                </div>
              ) : (
                /* ── Web image (no extra frame) ── */
                project.liveLink ? (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg shadow-lg overflow-hidden h-56 bg-gray-900 flex items-center justify-center w-full"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </a>
                ) : (
                  <div className="rounded-lg shadow-lg overflow-hidden h-56 bg-gray-900 flex items-center justify-center w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )
              )}
            </div>
            <div
              className={`w-1/2 px-8 ${index % 2 !== 0 ? "text-right" : "text-left"}`}
            >
              <h3 className="text-3xl font-bold text-cyan-400">
                {project.title}
              </h3>
              <p className="text-yellow-400 mb-2">{project.subtitle}</p>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div
                className={`flex flex-wrap items-center gap-2 ${index % 2 !== 0 ? "justify-end" : "justify-start"}`}
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div
                className={`flex gap-4 mt-4 ${index % 2 !== 0 ? "justify-end" : "justify-start"}`}
              >
                {project.githubLink && project.githubLink !== "#" && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    <FeatherIcon name="github" className="w-5 h-5" />
                    GitHub
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    <FeatherIcon name="externalLink" className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const testimonialsData = [
  // {
  //     quote: "Zahid is an outstanding developer who always delivers beyond expectations! He quickly understands project needs, suggests smart improvements, and implements them flawlessly. His dedication and attention to detail make the process smooth and stress-free.",
  //     name: "Nafi Ullah Shafin",
  //     title: "Software Engineer, App-Concept.com GmbH",
  //     image: "https://placehold.co/150x150/100d25/ffffff?text=Nafi"
  // },
  {
    quote:
      "Working with Zahid was a fantastic experience. His technical skills and creative problem-solving were instrumental in our project's success. He's a true professional and a great team player.",
    name: "Towhidur Rahman Asif",
    title: "Teammate",
    image: Asif,
  },
  {
    quote:
      "The quality of work delivered was exceptional. Zahid has a keen eye for design and writes clean, efficient code. I would highly recommend him for any frontend development role.",
    name: "Sahidur Rahman Sharif",
    title: "Teammate",
    image: Sharif,
  },
];

const KindWords = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonialsData.length) % testimonialsData.length,
    );
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section id="experience" className="py-24">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Kind Words
      </h2>
      <div className="max-w-3xl mx-auto bg-[var(--card-bg)]/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-700/50 shadow-2xl shadow-cyan-800/20 relative overflow-hidden">
        <div
          className="relative z-10 flex flex-col items-center text-center transition-opacity duration-500 ease-in-out"
          key={currentIndex}
        >
          <img
            src={currentTestimonial.image}
            alt={currentTestimonial.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-cyan-600/50 mb-6"
          />
          <p className="text-gray-300 italic text-lg leading-relaxed mb-6 h-36">
            "{currentTestimonial.quote}"
          </p>
          <h3 className="text-xl font-bold text-white">
            {currentTestimonial.name}
          </h3>
          <p className="text-[var(--primary-color)]">
            {currentTestimonial.title}
          </p>
        </div>

        <button
          onClick={prevTestimonial}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? "bg-white" : "bg-white/30 hover:bg-white/50"}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

const Artifacts = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalBodyRef = useRef(null);

  const commands = useRef({
    help: "Available commands: help, ls, resume, certificates, clear, ask",
    ls: `
            <p><span class="text-blue-400">./documents/</span></p>
            <p class="ml-4"><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">M._M._Zahid_Hasan_resume.pdf</a></p>
            <p><span class="text-blue-400">./certificates/</span></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1XsB32HCFXX_ZkUqSHuv4MWz520XyRegj/view" target="_blank" rel="noopener noreferrer" class="text-white hover:underline">AI_in_Healthcare_Hackathon_2026.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1w6eYjIYzAJpOo5a9w1LDFqL7VTkBZi2M/view" target="_blank" rel="noopener noreferrer" class="text-white hover:underline">Infinity_AI_BuildFest_2026.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1-afewOZmuXzM6bbGdfRYwW9JlfXUoMAB/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">2022-ICPC_Asia_Dhaka_Preliminary.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1fadr-hENkUy4EbFKtoRvAMrdJxy5HSMz/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">Intermediate_SQL_DataCamp.pdf</a></p>
            <p class="ml-4"><a href="https://www.hackerrank.com/certificates/cd9ceaf303ac" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">HackerRank_Problem_Solving.pdf</a></p>
        `,
    resume: `
            <p class="text-yellow-400">[RESUME (Latest Version)]</p>
            <p><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">M._M._Zahid_Hasan_resume.pdf</a></p>
            <p>Last modified: Jun 17, 2026</p>
            <p>Size: 159 KB</p>
        `,
    certificates: `
            <p class="text-yellow-400">[CERTIFICATIONS]</p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1XsB32HCFXX_ZkUqSHuv4MWz520XyRegj/view" target="_blank" rel="noopener noreferrer" class="text-white hover:underline">AI_in_Healthcare_Hackathon_2026.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1w6eYjIYzAJpOo5a9w1LDFqL7VTkBZi2M/view" target="_blank" rel="noopener noreferrer" class="text-white hover:underline">Infinity_AI_BuildFest_2026.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1-afewOZmuXzM6bbGdfRYwW9JlfXUoMAB/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">2022-ICPC_Asia_Dhaka_Preliminary.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1fadr-hENkUy4EbFKtoRvAMrdJxy5HSMz/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">Intermediate_SQL_DataCamp.pdf</a></p>
            <p class="ml-4"><a href="https://www.hackerrank.com/certificates/cd9ceaf303ac" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">HackerRank_Problem_Solving.pdf</a></p>
        `,
    clear: () => {
      setOutput([]);
      return ""; // Clear returns no message
    },
    ask: async (question) => {
      const suggestions = [
        'ask "What are his skills?"',
        'ask "What projects has he built?"',
        'ask "Where does he work?"',
        'ask "What is he studying?"',
      ];
      if (!question || !question.trim()) {
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        return `<p class="text-yellow-400">Usage: ask [your question]</p><p>Try: <span class="text-cyan-400 cursor-pointer">${randomSuggestion}</span></p>`;
      }
      // Clean up surrounding quotes if the user typed them: e.g. "what is X?" -> what is X?
      const cleanQuestion = question.trim().replace(/^["']|["']$/g, "");
      setIsLoading(true);
      const systemPrompt = `You are 'H-AI', a helpful AI assistant integrated into Zahid Hasan's portfolio terminal. Your goal is to answer questions about Zahid based on the provided context. Be friendly, professional, and slightly witty, like a terminal assistant. Keep your answers concise. If the question is outside the scope of the portfolio, politely say you can only answer questions about Zahid. Context: Zahid Hasan is a software engineer and researcher based in Bangladesh. He is pursuing a B.Sc. in Software Engineering at SUST, and works as a Software Engineer Intern at ShellBeeHaken Ltd. His work includes full-stack web and mobile development with React.js, Next.js, React Native, Node.js, and Express.js, plus Bangla speech AI research on TTS/STT pipelines. His projects include PsyCare, InnerSeed, Bangla TTS & STT Pipeline, MessEase, a mobile e-commerce shopping app, a cricket match management system, and a book recommendation system.`;
      const aiResponse = await callGemini(cleanQuestion, systemPrompt);
      setIsLoading(false);
      return aiResponse.replace(/\n/g, "<br/>");
    },
  }).current;

  const executeCommand = async (commandStr) => {
    if (!commandStr) return;

    // Save to history
    setCommandHistory((prev) => [commandStr, ...prev.filter(c => c !== commandStr)].slice(0, 50));
    setHistoryIndex(-1);

    setOutput((prev) => [...prev, { command: commandStr, result: "" }]);

    const trimmedInput = commandStr.trim();
    const spaceIndex = trimmedInput.indexOf(" ");
    
    let cmd = trimmedInput;
    let argStr = "";
    
    if (spaceIndex !== -1) {
      cmd = trimmedInput.substring(0, spaceIndex);
      argStr = trimmedInput.substring(spaceIndex + 1);
    }
    
    cmd = cmd.toLowerCase();
    let result;

    if (commands[cmd]) {
      const cmdFunc = commands[cmd];
      if (typeof cmdFunc === "function") {
        result = await cmdFunc(argStr);
      } else {
        result = cmdFunc;
      }
    } else {
      result = `<p>Command not found: ${cmd}. Type 'help' for a list of commands.</p>`;
    }

    setOutput((prev) => {
      const newOutput = [...prev];
      newOutput[newOutput.length - 1].result = result;
      return newOutput;
    });

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      if (commandHistory[newIndex] !== undefined) {
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : commandHistory[newIndex]);
    }
  };

  const suggested = [
    "ls",
    "resume",
    "certificates",
    'ask "what are his skills?"',
    "clear",
  ];

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [output, isLoading]);

  return (
    <section id="artifacts" className="py-24">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Downloadable Artifacts
      </h2>
      <div className="bg-black/80 backdrop-blur-md rounded-lg shadow-2xl max-w-4xl mx-auto font-fira border border-cyan-700">
        <div className="bg-gray-900/80 rounded-t-lg p-3 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div
          ref={terminalBodyRef}
          className="p-6 h-96 overflow-y-auto text-sm text-[var(--primary-color)]"
        >
          <p>Welcome to my portfolio terminal!</p>
          <p>Type a command or click one of the suggestions below.</p>
          <p className="text-cyan-400">
            Suggestions:
            {suggested.map((cmd) => (
              <span
                key={cmd}
                className="cursor-pointer hover:bg-gray-700 p-1 rounded ml-2"
                onClick={() => executeCommand(cmd)}
              >
                {cmd}
              </span>
            ))}
          </p>
          <div className="mt-4">
            {output.map((line, index) => (
              <div key={index}>
                <p>
                  <span className="text-cyan-400">visitor@portfolio:~$</span>{" "}
                  {line.command}
                </p>
                {line.result && (
                  <div
                    className="text-white"
                    dangerouslySetInnerHTML={{ __html: line.result }}
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <p className="text-yellow-400">H-AI is thinking...</p>
            )}
          </div>
        </div>
        <div className="bg-gray-900/80 rounded-b-lg p-3 flex items-center">
          <span className="text-cyan-400">visitor@portfolio:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none text-[var(--primary-color)] flex-grow ml-2 focus:outline-none"
            disabled={isLoading}
          />
          <div className="terminal-cursor"></div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSuggestMessage = async () => {
    setIsLoading(true);
    setError("");
    const prompt = `You are a friendly assistant helping a user write a contact message to Zahid Hasan, a frontend developer. The user's name is "${formData.name || "a visitor"}". Write a short, friendly, and professional message (about 2-3 sentences) asking about potential opportunities or collaborations. Keep it concise.`;
    const suggestedMessage = await callGemini(prompt);
    if (suggestedMessage.startsWith("Error:")) {
      setError(suggestedMessage);
    } else {
      setFormData((prev) => ({ ...prev, message: suggestedMessage }));
    }
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Netlify will handle submission automatically
    console.log("Form submitted:", formData);
    setSubmissionStatus({
      type: "success",
      message: "Thank you for your message!",
    });
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmissionStatus(null), 5000);
  };

  return (
    <section id="contact" className="py-24">
      <div className="text-center mb-12">
        <p className="text-sm text-[var(--secondary-color)] mb-2">
          Have questions or ideas? Let's talk.
        </p>
        <h2 className="text-4xl font-bold text-white">
          Get in Touch – Let's Connect
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <div className="bg-[var(--card-bg)]/80 backdrop-blur-md p-8 rounded-2xl border border-cyan-700/50">
          {/* ✅ Netlify form setup */}
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
          >
            {/* Hidden input required by Netlify */}
            <input type="hidden" name="form-name" value="contact" />

            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-700/80 border border-cyan-600/50 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
                placeholder="What's your good name?"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700/80 border border-cyan-600/50 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
                placeholder="What's your email address?"
                required
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-300"
                >
                  Your message
                </label>
                <button
                  type="button"
                  onClick={handleSuggestMessage}
                  disabled={isLoading}
                  className="text-xs text-[var(--primary-color)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Generating..." : "✨ Write with AI"}
                </button>
              </div>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="bg-gray-700/80 border border-cyan-600/50 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
                placeholder="How can I help you?"
                required
              ></textarea>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {submissionStatus && (
              <div
                className={`p-3 rounded-lg mb-4 text-sm ${
                  submissionStatus.type === "success"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-red-900/50 text-red-300"
                }`}
              >
                {submissionStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3.5 text-center flex items-center justify-center transition-colors group"
            >
              Send message
              <svg
                className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </form>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <img
            src={connect}
            alt="Contact illustration with network nodes"
            className="rounded-2xl object-contain w-full h-full max-h-[550px]"
          />
        </div>
      </div>
    </section>
  );
};
const Footer = () => (
  <footer className="py-8 border-t border-cyan-800/50">
    <div className="container mx-auto px-6 flex justify-between items-center text-gray-400">
      <p className="hover:text-white transition-colors cursor-pointer">
        Visit my blog
      </p>
      <div className="flex space-x-2">
        <a
          href="#"
          className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"
        >
          <FeatherIcon name="instagram" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"
        >
          <FeatherIcon name="facebook" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"
        >
          <FeatherIcon name="twitter" />
        </a>
        <a
          href="#"
          className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"
        >
          <FeatherIcon name="linkedin" />
        </a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="w-full relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-6">
          <Hero />
          <About />
          <Education />
          <Experience />
          <Skills />
          <Projects />
          <KindWords />
          <Artifacts />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
