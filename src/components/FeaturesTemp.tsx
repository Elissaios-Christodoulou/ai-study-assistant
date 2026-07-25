import FeatureCard from "./FeatureCard";
function Features() {
    const features =[
        {
            icon:"🤓",
            title:"AI Explanation",
            description:"Get simple explanations for difficult topics."            
        },
        {
            icon:"😎",
            title:"Smart Summaries",
            description:"Turn long notes into clear and useful summaries."            
        },
        {
            icon:"😵‍💫",
            title:"Practice Questions",
            description:"Create quizzes and test your knowledge."
        },
    ];
    return (
        <section id="features" className="features">
        <h2>Everything you need to study smarter</h2>

        <div className="features-grid">
            {features.map((feature) => (
                <FeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}                    
                />
            ))
            }            
        </div>
        
        </section>
  );
}

export default Features;