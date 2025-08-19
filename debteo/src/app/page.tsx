import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="min-h-dvh p-6 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Amigos Pay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Plataforma colaborativa para gestionar gastos y deudas con gamificación.
          </p>
          <div className="flex gap-3">
            <Button>Crear grupo</Button>
            <Button variant="outline">Añadir gasto</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
