import Navbar from '../components/Navbar';

const cards = [
  {
    icon: '👋',
    title: 'Who I Am',
    body: 'I\'m Amantle — a creative engineer living in the UK with roots in Botswana. I blend technical rigour with artistic flair.',
    gradient: 'linear-gradient(135deg, rgba(26,139,157,0.15), rgba(26,139,157,0.03))',
    border: 'rgba(26,139,157,0.3)',
  },
  {
    icon: '💻',
    title: 'What I Do',
    body: 'I design and build digital experiences — from embedded systems to slick web interfaces. Engineering is my canvas.',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.03))',
    border: 'rgba(139,92,246,0.3)',
  },
  {
    icon: '🧵',
    title: 'Seamstress',
    body: 'Fashion and fabric are a passion. I design and sew my own pieces — every stitch is intentional.',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.03))',
    border: 'rgba(236,72,153,0.3)',
  },
  {
    icon: '🎥',
    title: 'YouTuber',
    body: 'I document my creative process and share perspectives from my unique journey. Content that connects.',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.03))',
    border: 'rgba(245,158,11,0.3)',
  },
  {
    icon: '🎓',
    title: 'Student',
    body: '— TODO: Add your degree, university, and what you\'re studying here.',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.03))',
    border: 'rgba(16,185,129,0.3)',
  },
  {
    icon: '🌍',
    title: 'Botswana → UK',
    body: 'Two worlds, one perspective. Growing up in Botswana and building a career in the UK shapes everything I create.',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.03))',
    border: 'rgba(59,130,246,0.3)',
  },
];

export default function About() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="about-main">
        <div className="about-header">
          <p className="about-eyebrow">Get to know me</p>
          <h1 className="about-title">A little about Amantle</h1>
          <p className="about-subtitle">
            Designer, engineer, creator — these are placeholder cards. Replace them with your own story.
          </p>
        </div>

        <div className="cards-grid">
          {cards.map((card, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                background: card.gradient,
                borderColor: card.border,
              }}
            >
              <span className="glass-card-icon">{card.icon}</span>
              <h3 className="glass-card-title">{card.title}</h3>
              <p className="glass-card-body">{card.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
