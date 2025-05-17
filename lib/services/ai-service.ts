import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateCoverLetter(jobTitle: string, companyName: string, userProfile: any) {
  try {
    // Construire un prompt détaillé pour la génération de la lettre
    const prompt = `
    Rédige une lettre de motivation professionnelle en français pour un poste de ${jobTitle} chez ${companyName}.
    
    Informations sur le candidat:
    - Nom: ${userProfile.name || "le candidat"}
    - Expérience: ${userProfile.experience || "Expérience professionnelle pertinente"}
    - Compétences: ${userProfile.skills?.join(", ") || "Compétences pertinentes pour le poste"}
    
    La lettre doit être formelle, professionnelle et adaptée au poste. 
    Elle doit inclure:
    - Une introduction expliquant l'intérêt pour le poste
    - Un paragraphe sur l'expérience pertinente
    - Un paragraphe sur les compétences adaptées au poste
    - Une conclusion exprimant la motivation et la disponibilité pour un entretien
    
    Format: Lettre formelle avec formule de politesse appropriée.
    Longueur: Environ 300-400 mots.
    Ton: Professionnel, confiant mais pas arrogant.
    `

    // Utiliser l'API OpenAI via AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 800,
    })

    return text.trim()
  } catch (error) {
    console.error("Erreur lors de la génération de la lettre de motivation:", error)

    // Retourner une lettre par défaut en cas d'erreur
    return `Madame, Monsieur,

Je vous soumets ma candidature avec enthousiasme pour le poste de ${jobTitle} au sein de ${companyName}.

Mon expérience professionnelle dans le domaine, combinée à mes compétences techniques et relationnelles, me permettent de penser que je pourrais apporter une contribution significative à votre équipe.

J'ai notamment développé une expertise en développement web et en gestion de projet qui correspond parfaitement aux exigences mentionnées dans votre offre. Ma capacité à travailler en équipe et à m'adapter rapidement à de nouveaux environnements constitue également un atout pour ce poste.

Je serais ravi(e) de pouvoir échanger avec vous lors d'un entretien pour vous présenter plus en détail mon parcours et ma motivation.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`
  }
}
