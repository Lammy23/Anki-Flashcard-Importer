import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const InstructionsPanel = () => {
  const [openSection, setOpenSection] = useState('modelC');
  
  const sections = {
    modelC: {
      title: "Model C Structure",
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-4">Note Type Structure</h3>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <pre className="whitespace-pre-wrap">
              Note Type: [Note Type Name]
              Field 1: [Field 1 Name]
              Field 2: [Field 2 Name]

              Card 1:
                Front Template:
                ---
                {"{{cloze:[Field 1 Name]}}"}
                ---
                Back Template:
                ---
                {"{{cloze:[Field 1 Name]}}"}<br/>
                {"{{[Field 2 Name]}}"}
                ---
            </pre>
          </div>
          
          <h3 className="text-lg font-semibold mb-4">Deck Structure</h3>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <pre className="whitespace-pre-wrap">
              #separator:|||SEPARATOR|||
              #html:true
              #notetype column:1
              #deck column:2
              [Note Type Name]|||SEPARATOR|||[Deck Name]|||SEPARATOR|||[Field 1 Content]|||SEPARATOR|||[Field 2 Content]
            </pre>
          </div>
        </div>
      )
    },
    rules: {
      title: "Important Rules",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-2">
              <li>Deck and Note Type names must be identical and end with 'Cloze'</li>
              <li>No duplicate content allowed in Field 1</li>
              <li>Cloze deletions ({"{{c1::text}}"}) only in Field 1, never Field 2</li>
              <li>Use LaTeX for math expressions: \( equation \)</li>
              <li>Avoid consecutive closing braces {'}'}{'}'} in cloze deletions</li>
              <li>Always use {'<br>'} for line breaks, never raw newlines</li>
              <li>Images must use web URLs in src attribute</li>
              <li>Include hints in cloze deletions when possible: {"{{c1::answer::hint}}"}</li>
            </ol>
          </div>
        </div>
      )
    },
    examples: {
      title: "Examples",
      content: (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Basic Cloze Card</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                History-Cloze|||SEPARATOR|||History-Cloze|||SEPARATOR|||{"{{c1::World War II::Global conflict}} ended in {{c2::1945::year}}"}|||SEPARATOR|||This conflict reshaped the modern world.
              </pre>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Math Formula Card</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                Math-Cloze|||SEPARATOR|||Math-Cloze|||SEPARATOR|||The quadratic formula is {"{{c1::\\(x = \\frac{-b \\pm \\left.\\sqrt{b^2 - 4ac}\\right.}{2a}\\)::solution formula}}"}|||SEPARATOR|||Used to solve ax² + bx + c = 0
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Code Example Card</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                Python-Cloze|||SEPARATOR|||Python-Cloze|||SEPARATOR|||{"<div class='code-block'>def greet(name):<br>    print(f'Hello, {{c1::name::parameter}}!')</div>"}|||SEPARATOR|||A simple greeting function
              </pre>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Anki Import Instructions</h2>
      
      {Object.entries(sections).map(([key, section]) => (
        <div key={key} className="mb-4 border rounded-lg">
          <button
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            onClick={() => setOpenSection(openSection === key ? '' : key)}
          >
            <span className="font-semibold">{section.title}</span>
            {openSection === key ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {openSection === key && (
            <div className="p-4 border-t">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InstructionsPanel;