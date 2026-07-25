function Hero() {
    const handleGetStarted = () => {
        const featuresSection = document.getElementById("assistant");

        featuresSection?.scrollIntoView({
            behavior: "smooth",
        });
    };
    return (
        <section id="home" className="hero">
            <h1>AI Study Assistant</h1>
            <p>Learn smarter with AI.</p>

            <button onClick={handleGetStarted}>Get Started</button>
        </section>
    )
}
export default Hero;