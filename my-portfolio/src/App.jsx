import React, { useState, useEffect, useRef } from 'react';
 
import profileImg from "./assets/profile.jpg";

import  Asif from "./assets/Asif.jpg";

import  Sharif from "./assets/Sharif.jpg";
import connect from"./assets/connect.png";
import MessEaseImg from './assets/MessEase.webp';
import PsycareImg from './assets/PhyCare.webp';

import AIShomachar from './assets/AI-Shomachar.webp';
import BookRecomendation from './assets/BookRecomendation (1).webp';
import contexify from './assets/contexify.png';
// --- Gemini API Helper Function ---
// A utility to call the Gemini API.
// NOTE: The API key is intentionally left as an empty string.
// The execution environment will automatically handle authentication.
async function callGemini(prompt, systemInstruction) {
    const apiKey = "AIzaSyDUivAotqqIz3krUxqB5kqkwBcYMzaYxUs"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    if (systemInstruction) {
        payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error:", errorBody);
            return `Error: ${response.statusText}`;
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        ),
        github: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
        ),
        linkedin: (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
            </svg>
        ),
        mail: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
        ),
         externalLink: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        )
    };

    return icons[name] || null;
};

const navLinks = [
    { href: "#about", label: "About" },
    { href: "#education", label: "Education" },
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
                <a href="#hero" className="text-2xl font-bold text-white">Zahid<span className="text-[var(--primary-color)]">.</span></a>
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} className="nav-link text-gray-300 hover:text-[var(--primary-color)]">{link.label}</a>
                    ))}
                </nav>
                <button id="mobile-menu-button" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <FeatherIcon name="menu" />
                </button>
            </div>
            {isMenuOpen && (
                <div id="mobile-menu" className="md:hidden px-6 pb-4">
                    {navLinks.map(link => (
                         <a key={link.href} href={link.href} className="block py-2 text-gray-300 hover:text-[var(--primary-color)]" onClick={() => setIsMenuOpen(false)}>{link.label}</a>
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
        const ctx = canvas.getContext('2d');
        let particles = [];
        let floatingElements = [];
        let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let animationFrameId;

        const CodeSymbols = [
            '{ }', '< />', '( )', '[ ]', '=>', '===', '!==',   '==', '!=', '>=', '<=', '?:', '??',  '|', '&', '^', '~', '<<', '>>',  '::', '=>', '<>','&&', '||', 'fn', 'var', 'let', 'const', 
            'class', 'import', 'export', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'OOP', 'Functional', 'Array', 'Stack', 'Queue', 'Tree', 'Graph', 'HashMap', 'Recursion',
  'DP', 'Greedy', 'DFS', 'BFS', 'Binary Search', 'AWS','REST', 'GraphQL', 'API', 'Callback', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this',
  'super', 'extends', 'implements', 'interface', 'public', 'private', 'protected', 'static',
  'Algorithm', 'Bug', 'Debug', 'Deploy', 'Build', 'Test', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB','NPM', 'Yarn', 'Vite', 'Webpack', 'Firebase',

            'React', 'Vue', 'Angular', 'Node', 'Git', 'Docker'
        ];

        const resizeCanvas = () => {
            if(!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initAnimation = () => {
            if(!canvas || !floatingContainer) return;
            resizeCanvas();
            particles = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2.5 + 1.5,
                opacity: Math.random() * 0.6 + 0.3,
                color: ['#c084fc', '#22d3ee', '#d1d5db', '#f9fafb'][Math.floor(Math.random() * 4)]
            }));

            while (floatingContainer.firstChild) {
                floatingContainer.removeChild(floatingContainer.firstChild);
            }

            floatingElements = Array.from({ length: 12 }, (_, i) => {
                const element = document.createElement('div');
                element.className = "absolute font-mono text-sm font-bold pointer-events-none select-none";
                const vibrantColors = ['#E53E3E', '#F6E05E', '#E34234', '#007FFF', '#ED8936', '#FF69B4', '#FFBF00', '#FA8072', '#D53F8C'];
                const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
                const size = Math.random() * 20 + 15;
                element.innerText = CodeSymbols[Math.floor(Math.random() * CodeSymbols.length)];
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
                    drift: { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 }
                };
            });
        };

        const animate = () => {
            if(!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
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
                ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
                ctx.fill();
            });

            ctx.strokeStyle = `rgba(8, 145, 178, 0.3)`;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        const opacity = 1 - (distance / 150);
                        ctx.globalAlpha = opacity * 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            
            floatingElements.forEach(el => {
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
        const handleMouseMove = e => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (floatingContainerRef.current) {
                 while (floatingContainerRef.current.firstChild) {
                    floatingContainerRef.current.removeChild(floatingContainerRef.current.firstChild);
                }
            }
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0"></canvas>
            <div ref={floatingContainerRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></div>
        </>
    );
};

const Hero = () => {
    const [typingText, setTypingText] = useState('');
    const roles = ['Software Engineering Student', 'Full Stack Web Developer', 'Problem Solver'];

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
                const typeSpeed = isDeleting ? 100 : 200;
                timeout = setTimeout(type, typeSpeed);
            }
        }
        
        type();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <section id="hero" className="min-h-screen flex items-center pt-20 md:pt-0 relative">
            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                <div className="text-center md:text-left">
                    <p className="text-cyan-400 text-lg mb-2">I am</p>
                    <h1 className="text-5xl md:text-6xl font-bold text-white">M. M. Zahid Hasan</h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 mt-3">And I'm a <span id="typing-text" className="text-purple-400">{typingText}</span></h2>
                    <p className="text-gray-300 mt-6 max-w-lg mx-auto md:mx-0">
                        I am a software Engineering student passionate about turning ideas into code.
                    </p>
                    <div className="flex flex-col items-center justify-center md:items-start gap-6 mt-8">
                        <div className="flex items-center gap-4">
                            <a href="https://github.com/ZahidHasan7" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 hover:text-purple-400 transition-colors">
                                <FeatherIcon name="github" className="w-6 h-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/zahid-hasan-0175b7238" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 hover:text-purple-400 transition-colors">
                                <FeatherIcon name="linkedin" className="w-6 h-6" />
                            </a>
                            <a href="mailto:m.m.zahidhasan7@gmail.com" className="w-12 h-12 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 hover:text-purple-400 transition-colors">
                                <FeatherIcon name="mail" className="w-6 h-6" />
                            </a>
                        </div>
                        <a 
                            href="https://drive.google.com/file/d/1TF89ERj2f18dSbctS-svVtLqr37uKYpr/view?usp=sharing" // TODO: Replace with the actual path to your CV file
                            download
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
 className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full object-cover border-8 border-cyan-800/50 shadow-2xl shadow-cyan-700/30 ml-4"               />
                </div>
            </div>
        </section>
    );
};


const About = () => (
  <section id="about" className="py-24">
    <div className="text-center mb-12">
      <p className="text-sm text-[var(--primary-color)] bg-[var(--card-bg)]/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full mb-2">
        Introduction
      </p>
      <h2 className="text-4xl font-bold text-white">Overview</h2>
    </div>
    <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-md p-8 rounded-lg">
      <p className="text-gray-300 leading-relaxed text-xl ">
        I'm a skilled software developer with experience in JavaScript, and expertise in frameworks like React, Node.js. I'm a quick learner and collaborate closely with teammates to create efficient, scalable, and user-friendly solutions that solve real-world problems.
      </p>
      <p className="text-gray-300 leading-relaxed mt-4 text-xl ">
        I have completed 350+ problems across various online judges such as Codeforces, LeetCode and Vjudge
      </p>
      <p className="text-gray-300 leading-relaxed mt-4 text-xl ">
        I have built and deployed full-stack web applications using Javascript, React, Tailwind CSS, Node.js, MongoDB.
      </p>
    </div>
  </section>
);



const educationData = [
    {
        degree: "B.Sc.(Eng.) in Software Engineering, IICT",
        institution: "Shahjalal University Of Science And Technology, Sylhet",
        duration: "March 2022 – Present"
    },
    {
        degree: "Higher Secondary Certificate",
        institution: "Government Science College,Tejgaon, Dhaka",
        duration: "July 2018 - June 2020."
    }
];

const Education = () => (
    <section id="education" className="py-24">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Education</h2>
        <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-cyan-700/50 pl-10 space-y-12">
                {educationData.map((edu, index) => (
                    <div key={index} className="relative">
                        <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-[var(--card-bg)]/80 rounded-full border-4 border-cyan-500"></div>
                        <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                        <p className="text-cyan-400 font-semibold mb-1">{edu.institution}</p>
                        <p className="text-gray-400 text-sm">{edu.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const skillsData = [
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "C/C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
    { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    { name: "Matplotlib", icon: "https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
    { name: "Render", icon: "https://placehold.co/100x100/100d25/ffffff?text=Render" }
];

const Skills = () => (
    <section id="skills" className="py-24">
        <div className="text-center mb-12">
            <p className="text-sm text-[var(--primary-color)] bg-[var(--card-bg)]/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full mb-2">▼ What I Bring to the Table</p>
            <h2 className="text-4xl font-bold text-white">My Key Skills</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {skillsData.map(skill => (
                <div key={skill.name} className="bg-[var(--card-bg)]/80 backdrop-blur-md border border-cyan-800/50 rounded-lg p-6 text-center transition-all duration-300 hover:bg-cyan-900/40 hover:-translate-y-2 flex flex-col items-center justify-center">
                    <img src={skill.icon} className="h-16 w-16 mx-auto mb-4 object-contain" alt={`${skill.name} Icon`} />
                    <h3 className="font-semibold text-white mt-auto">{skill.name}</h3>
                </div>
            ))}
        </div>
    </section>
);

const projectsData = [
    {
        title: "PsyCare",
        subtitle: "Mental Health Platform",
           // liveLink: "#",
        githubLink: "#",
        description: "A comprehensive mental wellness platform offering anonymous problem-sharing, AI-powered insights, and private video sessions with verified mental health professionals.",
        tags: ["react.js", "express.js", "node.js", "mongoDB", "mongoose", "jwt", "tailwind css", "vite", "webrtc", "openapi", "figma"],
        image: PsycareImg,
       // liveLink: "",
        githubLink: "https://github.com/ZahidHasan7/Psycare",
    },
    {
        title: "MessEase",
        subtitle: "Multi-Tenant Mess Management Platform",
        description: "MessEase simplifies meal and expense tracking for shared living. A manager-centric system where managers handle entries, and members view transparent reports. No paperwork, no hassle.",
        tags: ["react.js", "express.js", "node.js", "mongoDB", "mongoose", "jwt"],
        image: MessEaseImg,
        liveLink: "https://mess-easy.vercel.app/",
        githubLink: "https://github.com/ZahidHasan7/MessEase-A_mess_management_system",
    },
    {
  title: "Book Recommender System",
  subtitle: "AI-Powered Book Recommendation System",
  description: "A web application that suggests books using popularity-based and collaborative filtering models, built with Python, Flask, and Scikit-learn.",
  tags: ["Python", "Flask", "Pandas", "Scikit-learn", "Render"],
  image: BookRecomendation, // You'll need to import an image for this
  liveLink: "https://book-recommender-system-v20n.onrender.com/",
  githubLink: "https://github.com/ZahidHasan7/Book_Recommender_System.git",
},
    {
        title: "AI-Shomachar",
        subtitle: "AI-Powered SaaS Content Generation Platform",
        description: "AI-Shomachar is a full-stack MERN application for text, code, and content generation. It features a custom JWT-based authentication system and integrates LLM APIs for AI-driven functionalities",
      tags: ["React", "Express.js", "Node.js", "MongoDB", "JWT", "LLM APIs", "Tailwind CSS"],

        image: AIShomachar,
        liveLink: "",
        githubLink: "https://github.com/TOWHID16/AI_Shomachar",
    }, 
    {
  title: "Contextify",
  subtitle: "AI-Powered Context Extension for Chrome",
  description: "Get instant, AI-generated summaries and context for any highlighted text on a webpage without leaving your tab.",
  tags: ["Chrome Extension", "Manifest V3", "JavaScript", "Gemini API", "Marked.js"],
  image:contexify, // You'll need to import an image for this
  liveLink: "", // Add the Chrome Web Store link here when published
  githubLink: "https://github.com/ZahidHasan7/Contextify-extention-.git",
}
];

const Projects = () => (
    <section id="projects" className="py-24">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Latest Works</h2>
        <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-cyan-700/50"></div>
            {projectsData.map((project, index) => (
                <div key={index} className="relative mb-16 flex justify-center">
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-[var(--card-bg)] z-10"></div>
                    <div className={`flex items-center w-full max-w-4xl ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                        <div className="w-1/2 px-8">
                           <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                <img src={project.image} alt={project.title} className="rounded-lg shadow-lg w-full transition-transform duration-300 hover:scale-105" />
                           </a>
                        </div>
                        <div className={`w-1/2 px-8 ${index % 2 !== 0 ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-3xl font-bold text-cyan-400">{project.title}</h3>
                            <p className="text-yellow-400 mb-2">{project.subtitle}</p>
                            <p className="text-gray-300 mb-4">{project.description}</p>
                            <div className={`flex flex-wrap items-center gap-2 ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}>
                                {project.tags.map(tag => (
                                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className={`flex gap-4 mt-4 ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}>
                               <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
                                    <FeatherIcon name="github" className="w-5 h-5" />
                                    GitHub
                               </a>
                               <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors">
                                    <FeatherIcon name="externalLink" className="w-5 h-5" />
                                    Live Demo
                               </a>
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
        quote: "Working with Zahid was a fantastic experience. His technical skills and creative problem-solving were instrumental in our project's success. He's a true professional and a great team player.",
        name: "Towhidur Rahman Asif",
        title: "Teammate",
        image:  Asif
    },
    {
        quote: "The quality of work delivered was exceptional. Zahid has a keen eye for design and writes clean, efficient code. I would highly recommend him for any frontend development role.",
        name: "Sahidur Rahman Sharif",
        title: "Teammate",
        image: Sharif
    }
];

const KindWords = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const currentTestimonial = testimonialsData[currentIndex];

    return (
        <section id="experience" className="py-24">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Kind Words</h2>
            <div className="max-w-3xl mx-auto bg-[var(--card-bg)]/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-cyan-700/50 shadow-2xl shadow-cyan-800/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center text-center transition-opacity duration-500 ease-in-out" key={currentIndex}>
                    <img src={currentTestimonial.image} alt={currentTestimonial.name} className="w-24 h-24 rounded-full object-cover border-4 border-cyan-600/50 mb-6"/>
                    <p className="text-gray-300 italic text-lg leading-relaxed mb-6 h-36">"{currentTestimonial.quote}"</p>
                    <h3 className="text-xl font-bold text-white">{currentTestimonial.name}</h3>
                    <p className="text-[var(--primary-color)]">{currentTestimonial.title}</p>
                </div>

                <button onClick={prevTestimonial} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button onClick={nextTestimonial} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {testimonialsData.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Artifacts = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const terminalBodyRef = useRef(null);

    const commands = useRef({
        'help': 'Available commands: help, ls, resume, certificates, clear, ask',
        'ls': `
            <p><span class="text-blue-400">./documents/</span></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1TF89ERj2f18dSbctS-svVtLqr37uKYpr/view?usp=sharing" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">M._M._Zahid_Hasan_resume.pdf</a></p>
            <p><span class="text-blue-400">./certificates/</span></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1-afewOZmuXzM6bbGdfRYwW9JlfXUoMAB/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">2022-ICPC_Asia_Dhaka_Preliminary.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1fadr-hENkUy4EbFKtoRvAMrdJxy5HSMz/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">Intermediate_SQL_DataCamp.pdf</a></p>
            <p class="ml-4"><a href="https://www.hackerrank.com/certificates/cd9ceaf303ac" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">HackerRank_Problem_Solving.pdf</a></p>
        `,
        'resume': `
            <p class="text-yellow-400">[RESUME (Latest Version)]</p>
            <p><a href="https://drive.google.com/file/d/1TF89ERj2f18dSbctS-svVtLqr37uKYpr/view?usp=sharing" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">M._M._Zahid_Hasan_resume.pdf</a></p>
            <p>Last modified: Sep 07, 2025</p>
            <p>Size: 245 KB</p>
        `,
        'certificates': `
            <p class="text-yellow-400">[CERTIFICATIONS]</p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1-afewOZmuXzM6bbGdfRYwW9JlfXUoMAB/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">2022-ICPC_Asia_Dhaka_Preliminary.pdf</a></p>
            <p class="ml-4"><a href="https://drive.google.com/file/d/1fadr-hENkUy4EbFKtoRvAMrdJxy5HSMz/view" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">Intermediate_SQL_DataCamp.pdf</a></p>
            <p class="ml-4"><a href="https://www.hackerrank.com/certificates/cd9ceaf303ac" target="_blank" rel="noopener noreferrer" download class="text-white hover:underline">HackerRank_Problem_Solving.pdf</a></p>
        `,
        'clear': () => {
            setOutput([]);
            return ''; // Clear returns no message
        },
        'ask': async (question) => {
             if (!question) {
                return "Please ask a question. Usage: ask [your question]";
            }
            setIsLoading(true);
            const systemPrompt = `You are 'H-AI', a helpful AI assistant integrated into Zahid Hasan's portfolio terminal. Your goal is to answer questions about Zahid based on the provided context. Be friendly, professional, and slightly witty, like a terminal assistant. Keep your answers concise. If the question is outside the scope of the portfolio, politely say you can only answer questions about Zahid. Context: Zahid Hasan is a Frontend Developer from Sri Lanka specializing in React, Tailwind CSS, Node.js, and MongoDB. He has worked as a Frontend Developer at Creative Tech Inc. since 2023 and was previously a Web Developer Intern at Digital Solutions Co. His projects include an E-commerce Platform, a Task Management App, and a Data Visualization dashboard.`;
            const aiResponse = await callGemini(question, systemPrompt);
            setIsLoading(false);
            return aiResponse.replace(/\n/g, '<br/>');
        }
    }).current;

    const executeCommand = async (commandStr) => {
        if (!commandStr) return;
        
        setOutput(prev => [...prev, { command: commandStr, result: '' }]);
        
        const [cmd, ...args] = commandStr.trim().toLowerCase().split(' ');
        const argStr = args.join(' ');

        let result;

        if (commands[cmd]) {
            const cmdFunc = commands[cmd];
            if (typeof cmdFunc === 'function') {
                result = await cmdFunc(argStr);
            } else {
                result = cmdFunc;
            }
        } else {
            result = `<p>Command not found: ${cmd}. Type 'help' for a list of commands.</p>`;
        }
        
        setOutput(prev => {
            const newOutput = [...prev];
            newOutput[newOutput.length - 1].result = result;
            return newOutput;
        });

        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            executeCommand(input);
        }
    };

    const suggested = ['ls', 'resume', 'certificates', 'ask "what are his skills?"', 'clear'];

    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    }, [output, isLoading]);

    return (
        <section id="artifacts" className="py-24">
             <h2 className="text-4xl font-bold text-center text-white mb-12">Downloadable Artifacts</h2>
             <div className="bg-black/80 backdrop-blur-md rounded-lg shadow-2xl max-w-4xl mx-auto font-fira border border-cyan-700">
                <div className="bg-gray-900/80 rounded-t-lg p-3 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div ref={terminalBodyRef} className="p-6 h-96 overflow-y-auto text-sm text-[var(--primary-color)]">
                    <p>Welcome to my portfolio terminal!</p>
                    <p>Type a command or click one of the suggestions below.</p>
                    <p className="text-cyan-400">Suggestions: 
                        {suggested.map(cmd => (
                            <span key={cmd} className="cursor-pointer hover:bg-gray-700 p-1 rounded ml-2" onClick={() => executeCommand(cmd)}>{cmd}</span>
                        ))}
                    </p>
                    <div className="mt-4">
                        {output.map((line, index) => (
                             <div key={index}>
                                 <p><span className="text-cyan-400">visitor@portfolio:~$</span> {line.command}</p>
                                 { line.result && <div className="text-white" dangerouslySetInnerHTML={{ __html: line.result }} /> }
                            </div>
                        ))}
                         {isLoading && <p className="text-yellow-400">H-AI is thinking...</p>}
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
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
                  {isLoading ? "Generating..." : "✨ Suggest with AI"}
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
            <p className="hover:text-white transition-colors cursor-pointer">Visit my blog</p>
            <div className="flex space-x-2">
                <a href="#" className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"><FeatherIcon name="instagram"/></a>
                <a href="#" className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"><FeatherIcon name="facebook"/></a>
                <a href="#" className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"><FeatherIcon name="twitter"/></a>
                 <a href="#" className="w-10 h-10 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] transition-colors"><FeatherIcon name="linkedin"/></a>
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

