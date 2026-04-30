export default function Newsletter() {
  return (
    <section
      className="w-full bg-[var(--color-brand)] px-[120px] py-20 rounded-t-[40px] flex flex-col items-center gap-8"
      style={{ boxShadow: "var(--shadow-hero)" }}
    >
      <h2 className="w-[600px] text-[32px] font-bold text-white tracking-[-1px] leading-[1.2] text-center">
        Recevez nos fiches réglementaires gratuites.
      </h2>
      <p className="w-[550px] text-[16px] text-white/80 leading-[1.6] text-center">
        Chaque mois, une fiche synthétique sur l&apos;actualité réglementaire bancaire et financière.
        Directement dans votre boîte mail.
      </p>

      <form className="w-[500px] flex items-center gap-3">
        <div className="flex-1 h-12 bg-white rounded-xl px-5 flex items-center">
          <input
            type="email"
            placeholder="votre@email.com"
            className="w-full text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-text-muted)] outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-12 bg-[var(--color-ink)] text-white rounded-xl px-7 py-4 flex items-center justify-center gap-2 text-[15px] font-semibold hover:bg-black transition-colors"
        >
          S&apos;inscrire
        </button>
      </form>

      <p className="w-[450px] text-[11px] text-white/50 leading-[1.5] text-center">
        En vous inscrivant, vous acceptez de recevoir nos communications. Désabonnement en un clic.
        Données traitées conformément au RGPD.
      </p>
    </section>
  );
}
