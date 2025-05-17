// Ce script peut être exécuté manuellement pour initialiser la base de données avec des offres d'emploi
// Vous pouvez l'exécuter avec: npx ts-node scripts/seed-jobs.ts

import { MongoClient } from "mongodb"
import type { Job } from "../lib/models/job"

const uri = process.env.MONGODB_URI as string
const dbName = process.env.MONGODB_DB as string

if (!uri) {
  console.error("Please add your MongoDB URI to .env.local")
  process.exit(1)
}

async function seedJobs() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)
    const jobsCollection = db.collection("jobs")

    // Vérifier si la collection existe déjà et contient des données
    const count = await jobsCollection.countDocuments()
    if (count > 0) {
      console.log(`La collection jobs contient déjà ${count} documents. Suppression...`)
      await jobsCollection.deleteMany({})
    }

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Créer des offres d'emploi fictives
    const jobs: Partial<Job>[] = [
      {
        title: "Développeur Frontend React",
        company: "TechVision",
        companyLogo: "/abstract-tech-logo.png",
        companyWebsite: "https://example.com",
        companyDescription:
          "TechVision est une entreprise innovante spécialisée dans le développement de solutions web et mobiles pour les entreprises de toutes tailles.",
        location: "Paris",
        type: "CDI",
        salary: "45 000€ - 60 000€",
        description:
          "Nous recherchons un développeur Frontend React passionné pour rejoindre notre équipe et participer au développement de nos applications web.",
        responsibilities: [
          "Développer des interfaces utilisateur réactives et intuitives",
          "Collaborer avec les designers UX/UI pour implémenter les maquettes",
          "Participer à l'amélioration continue de nos produits",
          "Assurer la maintenance et le debugging des applications existantes",
        ],
        requirements: [
          "3+ ans d'expérience en développement frontend",
          "Maîtrise de React, TypeScript et des hooks",
          "Expérience avec Next.js et les API RESTful",
          "Connaissance des bonnes pratiques en matière d'accessibilité web",
        ],
        niceToHave: [
          "Expérience avec les tests unitaires et d'intégration",
          "Connaissance de GraphQL",
          "Expérience avec les animations CSS et les transitions",
        ],
        benefits: [
          "Télétravail partiel",
          "Horaires flexibles",
          "Formation continue",
          "Mutuelle d'entreprise",
          "Tickets restaurant",
          "Participation aux bénéfices",
        ],
        experienceLevel: "3-5 ans",
        education: "Bac+3 minimum",
        languages: ["Français", "Anglais"],
        remote: true,
        urgent: false,
        postedAt: now,
        startDate: "Dès que possible",
        applicationDeadline: oneMonthLater,
        views: 245,
        applications: 18,
        status: "active",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Data Scientist",
        company: "DataInsight",
        companyLogo: "/data-company-logo.png",
        companyDescription:
          "DataInsight est une entreprise spécialisée dans l'analyse de données et l'intelligence artificielle, aidant les entreprises à prendre des décisions basées sur les données.",
        location: "Lyon",
        type: "CDI",
        salary: "50 000€ - 70 000€",
        description:
          "Nous recherchons un Data Scientist expérimenté pour rejoindre notre équipe et travailler sur des projets d'analyse de données et de machine learning.",
        responsibilities: [
          "Analyser et interpréter des ensembles de données complexes",
          "Développer des modèles de machine learning",
          "Collaborer avec les équipes produit pour intégrer les modèles",
          "Présenter les résultats aux parties prenantes",
        ],
        requirements: [
          "Master ou Doctorat en Data Science, Statistiques ou domaine connexe",
          "Expérience en Python et bibliothèques de data science (Pandas, NumPy, Scikit-learn)",
          "Connaissance des algorithmes de machine learning",
          "Expérience avec les bases de données SQL et NoSQL",
        ],
        experienceLevel: "2-4 ans",
        remote: false,
        urgent: true,
        postedAt: oneWeekAgo,
        views: 189,
        applications: 12,
        status: "active",
        createdAt: oneWeekAgo,
        updatedAt: oneWeekAgo,
      },
      // Ajoutez d'autres offres d'emploi ici...
    ]

    // Insérer les offres d'emploi dans la base de données
    const result = await jobsCollection.insertMany(jobs)
    console.log(`${result.insertedCount} offres d'emploi insérées avec succès`)
  } catch (error) {
    console.error("Erreur lors de l'initialisation des offres d'emploi:", error)
  } finally {
    await client.close()
    console.log("Connexion MongoDB fermée")
  }
}

seedJobs().catch(console.error)
