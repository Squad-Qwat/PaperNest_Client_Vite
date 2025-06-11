'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

export default function HeroSection() {
  return (
    <section className="container relative pt-24 mx-auto mt-18">
      <div className="flex flex-col justify-center items-center space-y-12 text-center">
        <Link to="/" className="flex items-center px-3 h-8 text-sm rounded-full border bg-accent">
          🎉
          <div
            data-orientation="vertical"
            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-2 h-4"
          ></div>
          Introducing PaperNest
          <ChevronRight className="ml-2 size-3" />
        </Link>
        <div className="space-y-12">
          <h1 className="mx-auto max-w-7xl text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 title-1">
            The{' '}
            <span className="inline-block relative px-1 bg-blue-500/20 text-foreground">
              AI Document
              <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute -right-2 -bottom-2 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute top-0 bottom-0 -left-1 w-1 bg-blue-500"></div>
              <div className="absolute top-0 bottom-0 -right-1 w-1 bg-blue-500"></div>
            </span>
            Writer Assitant
          </h1>
          <p className="mx-auto max-w-3xl paragraph-large text-muted-foreground">
            Used by some of the world's largest companies, PaperNest enable you to create{' '}
            <span className="font-semibold text-foreground">high-quality research paper</span> with
            the power of AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Button size="lg" className="w-full font-semibold border sm:w-max" variant="secondary">
            Learn PaperNest
          </Button>
          <Button size="lg" className="w-full font-semibold sm:w-max">
            Get Started!
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r rounded-full blur-3xl animate-pulse from-blue-400/20 to-purple-900/20"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl delay-1000 animate-pulse from-purple-400/15 to-pink-600/15"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r rounded-full blur-3xl animate-pulse from-cyan-400/10 to-blue-600/10 delay-2000"></div>
      </div>
    </section>
  )
}
