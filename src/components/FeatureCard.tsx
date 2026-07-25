type FeatureCardProps = {
    icon: string;
    title: string;
    description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {

    return (
        <section className="feature-card">

            <h3><span className="feature-icon">{icon}</span>{title}</h3>
            <p>{description}</p>
        </section>
    )

}
export default FeatureCard;
