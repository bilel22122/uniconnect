'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

const AVAILABLE_SKILLS = [
    "Accounting", "Adobe XD", "Android (Kotlin)", "Architecture", "Artificial Intelligence",
    "AutoCAD", "AWS", "Biology", "Blockchain", "Bootstrap", "Business Strategy",
    "C#", "Chemistry", "Civil Engineering", "Communication", "Content Writing",
    "Copywriting", "Customer Service", "Cyber Security", "Data Analysis", "Digital Marketing",
    "Django", "Docker", "Economics", "Electrical Engineering", "Electronics",
    "English (Language)", "Excel (Advanced)", "Express.js", "Figma", "Financial Analysis",
    "Firebase", "Flask", "Flutter", "French (Language)", "Git", "Google Cloud",
    "Graphic Design", "History", "HTML/CSS", "Human Resources (HR)", "Illustrator",
    "iOS (Swift)", "Java", "JavaScript", "Journalism", "Laravel", "Leadership",
    "Legal Research", "Linux", "Logistics", "Machine Learning", "Marketing",
    "Matlab", "Mechanical Design", "Medical Research", "MongoDB", "MySQL",
    "Next.js", "Node.js", "Nursing", "Nutrition", "Pharmacy", "Photoshop",
    "PHP", "Physics", "Political Science", "PostgreSQL", "Problem Solving",
    "Project Management", "Psychology", "Public Relations", "Public Speaking",
    "Python", "React", "React Native", "Redis", "Research", "Sales",
    "Sociology", "SolidWorks", "Spring Boot", "SQL", "Supabase", "Tailwind CSS",
    "Teaching", "Teamwork", "Time Management", "Translation", "TypeScript",
    "UI/UX Design", "Video Editing", "Vue.js", "Web Development", "Wordpress"
].sort();

interface SkillSelectorProps {
    selectedSkills: string[];
    onChange: (skills: string[]) => void;
}

export default function SkillSelector({ selectedSkills, onChange }: SkillSelectorProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredSkills = AVAILABLE_SKILLS.filter(skill =>
        skill.toLowerCase().includes(query.toLowerCase()) &&
        !selectedSkills.includes(skill)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (skill: string) => {
        if (!selectedSkills.includes(skill)) {
            onChange([...selectedSkills, skill]);
        }
        setQuery('');
        setIsOpen(true); // Keep open for multiple selection
    };

    const handleRemove = (skillToRemove: string) => {
        onChange(selectedSkills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="w-full space-y-3" ref={wrapperRef}>
            {/* Selected Tags Area */}
            <div className="flex flex-wrap gap-2 min-h-[30px]">
                {selectedSkills.map(skill => (
                    <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                        {skill}
                        <button
                            type="button"
                            onClick={() => handleRemove(skill)}
                            className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search for skills..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSkills.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No matching skills found
                            </div>
                        ) : (
                            <ul className="py-1">
                                {filteredSkills.map(skill => (
                                    <li key={skill}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(skill)}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between group transition-colors"
                                        >
                                            {skill}
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Check className="w-4 h-4 text-blue-600" />
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
