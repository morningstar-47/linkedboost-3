"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react" // Assurez-vous d'avoir next-auth configuré

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  companyName: string
}

export function JobApplicationForm({ jobId, jobTitle, companyName }: JobApplicationFormProps) {
  const { toast } = useToast()
  // const { data: session } = useSession()
  const session = { user: { id: "19999998999898989" }}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [personalMessage, setPersonalMessage] = useState("")
  const [useLinkedInProfile, setUseLinkedInProfile] = useState(true)
  const [useCvFromProfile, setUseCvFromProfile] = useState(true)
  const [cvStatus, setCvStatus] = useState<"loading" | "available" | "missing">("loading")
  const [hasApplied, setHasApplied] = useState(false)

  // Vérifier si l'utilisateur a déjà postulé à cette offre
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!session?.user?.id) return
  

      try {
        const response = await fetch(`/api/jobs/check-applied?userId=${session.user.id}&jobId=${jobId}`)
        const data = await response.json()
        setHasApplied(data.hasApplied)
      } catch (error) {
        console.error("Erreur lors de la vérification de la candidature:", error)
      }
    }

    checkIfApplied()
  }, [session, jobId])

  // Vérifier si l'utilisateur a un CV dans son profil
  useEffect(() => {
    const checkUserCv = async () => {
      if (!session?.user?.id) return

      try {
        setCvStatus("loading")
        const response = await fetch(`/api/user/has-cv?userId=${session.user.id}`)
        const data = await response.json()
        setCvStatus(data.hasCV ? "available" : "missing")
      } catch (error) {
        console.error("Erreur lors de la vérification du CV:", error)
        setCvStatus("missing")
      }
    }

    checkUserCv()
  }, [session])

  // Fonction pour générer une lettre de motivation avec l'IA
  const generateCoverLetter = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer une lettre de motivation.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/jobs/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          companyName,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération de la lettre")
      }

      const data = await response.json()
      setCoverLetter(data.coverLetter)

      toast({
        title: "Lettre générée avec succès",
        description: "Vous pouvez maintenant modifier la lettre selon vos besoins.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la lettre de motivation.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour postuler.",
        variant: "destructive",
      })
      return
    }

    if (hasApplied) {
      toast({
        title: "Information",
        description: "Vous avez déjà postulé à cette offre.",
        variant: "default",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          userId: session.user.id,
          coverLetter,
          personalMessage,
          useLinkedInProfile,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'envoi de la candidature")
      }

      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été envoyée avec succès.",
        variant: "default",
      })

      // Marquer comme postulé
      setHasApplied(true)

      // Réinitialiser le formulaire
      setCoverLetter("")
      setPersonalMessage("")
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre candidature.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Postuler à cette offre</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Connexion requise</AlertTitle>
            <AlertDescription className="text-blue-700 text-xs">
              Vous devez être connecté pour postuler à cette offre.
            </AlertDescription>
          </Alert>
          <Button className="w-full mt-4" onClick={() => (window.location.href = "/login")}>
            Se connecter
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (hasApplied) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Postuler à cette offre</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Candidature envoyée</AlertTitle>
            <AlertDescription className="text-green-700 text-xs">
              Vous avez déjà postulé à cette offre. Vous pouvez suivre l'état de votre candidature dans votre tableau de
              bord.
            </AlertDescription>
          </Alert>
          <Button className="w-full mt-4" onClick={() => (window.location.href = "/dashboard/applications")}>
            Voir mes candidatures
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Postuler à cette offre</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use-linkedin"
                checked={useLinkedInProfile}
                onCheckedChange={(checked) => setUseLinkedInProfile(checked as boolean)}
              />
              <Label htmlFor="use-linkedin" className="text-sm">
                Utiliser mon profil LinkedIn
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Nous utiliserons les informations de votre profil LinkedIn pour compléter votre candidature.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cover-letter">Lettre de motivation</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={generateCoverLetter}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Générer avec IA
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="cover-letter"
              placeholder="Votre lettre de motivation sera générée par l'IA et vous pourrez la personnaliser..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[200px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Vous pouvez modifier la lettre générée pour la personnaliser davantage.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal-message">Message personnalisé (optionnel)</Label>
            <Textarea
              id="personal-message"
              placeholder="Ajoutez un message personnel au recruteur..."
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Ce message sera ajouté à votre candidature pour donner un contexte supplémentaire.
            </p>
          </div>

          <div className="space-y-2">
            {cvStatus === "loading" ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Vérification du CV...</span>
              </div>
            ) : cvStatus === "available" ? (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">CV disponible</AlertTitle>
                <AlertDescription className="text-green-700 text-xs">
                  Votre CV est disponible dans votre profil et sera joint à votre candidature.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">CV manquant</AlertTitle>
                <AlertDescription className="text-red-700 text-xs">
                  Vous n'avez pas encore ajouté de CV à votre profil. Veuillez en ajouter un dans vos paramètres avant
                  de postuler ou utiliser votre profil LinkedIn.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting || !coverLetter || (cvStatus === "missing" && !useLinkedInProfile) || cvStatus === "loading"
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma candidature"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
