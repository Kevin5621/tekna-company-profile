'use client'

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export default function BackButton({ 
  href, 
  label = "Back",
  className = ""
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      return
    } else {
      router.back()
    }
  }

  if (href) {
    return (
      <Link href={href}>
        <Button variant="ghost" size="sm" className={className}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </Link>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleBack} className={className}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
