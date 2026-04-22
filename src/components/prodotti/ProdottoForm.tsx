'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Loader2, Package, Euro, Type, Palette, Ruler, Camera, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const prodottoSchema = z.object({
  sku: z.string().min(1, 'Lo SKU è obbligatorio'),
  descrizione: z.string().min(1, 'La descrizione è obbligatoria'),
  prezzoUnitario: z.string().or(z.number()).transform(v => typeof v === 'string' ? parseFloat(v) : v),
  taglie: z.array(z.string()).min(1, 'Inserisci almeno una taglia'),
  colori: z.array(z.string()).min(1, 'Inserisci almeno un colore'),
  fotoUrl: z.string().optional().or(z.literal('')),
})

type ProdottoForm = z.infer<typeof prodottoSchema>

export default function ProdottoForm({ params }: { params?: { id?: string } }) {
  const router = useRouter()
  const isEdit = !!params?.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [newTaglia, setNewTaglia] = useState('')
  const [newColore, setNewColore] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProdottoForm>({
    resolver: zodResolver(prodottoSchema),
    defaultValues: {
      taglie: [],
      colori: [],
    }
  })

  const taglie = watch('taglie') || []
  const colori = watch('colori') || []

  useEffect(() => {
    if (isEdit && params?.id) {
      fetchProdotto()
    }
  }, [isEdit, params?.id])

  const fetchProdotto = async () => {
    try {
      const res = await fetch(`/api/prodotti/${params?.id}`)
      if (res.ok) {
        const data = await res.json()
        reset(data)
      } else {
        router.push('/prodotti')
      }
    } catch (error) {
      console.error('Error fetching prodotto:', error)
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (data: ProdottoForm) => {
    setLoading(true)
    try {
      const url = isEdit ? `/api/prodotti/${params.id}` : '/api/prodotti'
      const method = isEdit ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/prodotti')
        router.refresh()
      } else {
        const errData = await res.json()
        alert(errData.error || 'Errore durante il salvataggio')
      }
    } catch (error) {
      console.error('Error saving prodotto:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = (result: any) => {
    if (result.event === 'success') {
      setValue('fotoUrl', result.info.secure_url)
    }
  }

  const addTaglia = () => {
    if (newTaglia && !taglie.includes(newTaglia)) {
      setValue('taglie', [...taglie, newTaglia.trim().toUpperCase()])
      setNewTaglia('')
    }
  }

  const removeTaglia = (t: string) => {
    setValue('taglie', taglie.filter(item => item !== t))
  }

  const addColore = () => {
    if (newColore && !colori.includes(newColore)) {
      setValue('colori', [...colori, newColore.trim().toUpperCase()])
      setNewColore('')
    }
  }

  const removeColore = (c: string) => {
    setValue('colori', colori.filter(item => item !== c))
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium">Caricamento scheda prodotto...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Back to Catlog */}
      <div className="flex items-center gap-4">
        <Link
          href="/prodotti"
          className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 text-slate-400 hover:text-indigo-600 hover:ring-indigo-200 transition-all font-inter"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
          </h1>
          <p className="text-sm text-slate-500">
            Configura SKU, prezzi e varianti di taglie/colori
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 md:p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">
            <Package className="w-4 h-4" />
            Informazioni Base
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 font-inter">
              <label className="text-xs font-bold text-slate-500 ml-1">Codice SKU <span className="text-red-500">*</span></label>
              <input
                {...register('sku')}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 transition-all focus:bg-white uppercase font-mono",
                  errors.sku ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500"
                )}
                placeholder="ES. ABT-2024-001"
              />
              {errors.sku && <p className="text-xs text-red-500 mt-1 ml-1 font-inter">{errors.sku.message}</p>}
            </div>

            <div className="space-y-1.5 font-inter">
              <label className="text-xs font-bold text-slate-500 ml-1">Prezzo Unitario (€) <span className="text-red-500">*</span></label>
              <div className="relative">
                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('prezzoUnitario')}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 transition-all focus:bg-white",
                    errors.prezzoUnitario ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500"
                  )}
                  placeholder="0.00"
                />
              </div>
              {errors.prezzoUnitario && <p className="text-xs text-red-500 mt-1 ml-1 font-inter">{errors.prezzoUnitario.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-1.5 font-inter">
              <label className="text-xs font-bold text-slate-500 ml-1">Descrizione <span className="text-red-500">*</span></label>
              <textarea
                {...register('descrizione')}
                rows={3}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 transition-all focus:bg-white resize-none text-sm font-inter",
                  errors.descrizione ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500"
                )}
                placeholder="Descrizione dettagliata del capo d'abbigliamento..."
              />
              {errors.descrizione && <p className="text-xs text-red-500 mt-1 ml-1 font-inter">{errors.descrizione.message}</p>}
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Taglie */}
          <div className="card p-6 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-4">
             <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2 font-inter">
                <Ruler className="w-4 h-4" />
                Taglie Disponibili
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaglia}
                  onChange={(e) => setNewTaglia(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTaglia())}
                  placeholder="Es. 38 o M"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all font-inter"
                />
                <button
                  type="button"
                  onClick={addTaglia}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all font-inter"
                >
                  Aggiungi
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {taglie.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md ring-1 ring-indigo-200 animate-scale-in font-inter">
                    {t}
                    <button type="button" onClick={() => removeTaglia(t)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.taglie && <p className="text-xs text-red-500 font-inter">{errors.taglie.message}</p>}
          </div>

          {/* Colori */}
          <div className="card p-6 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-4 font-inter">
             <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">
                <Palette className="w-4 h-4" />
                Colori Disponibili
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColore}
                  onChange={(e) => setNewColore(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColore())}
                  placeholder="Es. NERO o RED"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all font-inter"
                />
                <button
                  type="button"
                  onClick={addColore}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all font-inter"
                >
                  Aggiungi
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {colori.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md ring-1 ring-slate-200 animate-scale-in font-inter">
                    {c}
                    <button type="button" onClick={() => removeColore(c)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.colori && <p className="text-xs text-red-500 mt-1 ml-1 font-inter">{errors.colori.message}</p>}
          </div>
        </div>

        {/* Media info */}
        <div className="card p-6 md:p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2 font-inter">
            <Camera className="w-4 h-4" />
            Foto Prodotto
          </div>
          
          <div className="space-y-4">
            {!watch('fotoUrl') ? (
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{
                  maxFiles: 1,
                  clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                  styles: {
                    palette: {
                      window: "#FFFFFF",
                      windowBorder: "#E2E8F0",
                      tabIcon: "#4F46E5",
                      menuIcons: "#5A616A",
                      textDark: "#000000",
                      textLight: "#FFFFFF",
                      link: "#4F46E5",
                      action: "#4F46E5",
                      inactiveTabIcon: "#94A3B8",
                      error: "#EF4444",
                      inProgress: "#4F46E5",
                      complete: "#10B981",
                      sourceBg: "#F8FAFC"
                    }
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group font-inter"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Carica Foto Prodotto</p>
                      <p className="text-xs text-slate-400 mt-1">Clicca per scattare una foto o scegliere un file</p>
                    </div>
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <div className="relative w-40 h-40 group animate-scale-in">
                <img 
                  src={watch('fotoUrl')} 
                  alt="Anteprima" 
                  className="w-full h-full object-cover rounded-2xl shadow-lg ring-1 ring-slate-200" 
                />
                <button
                  type="button"
                  onClick={() => setValue('fotoUrl', '')}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                   <p className="text-[10px] font-bold text-white uppercase tracking-wider">Cambia Foto</p>
                </div>
              </div>
            )}
            
            <input type="hidden" {...register('fotoUrl')} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/prodotti"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all font-inter"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 font-inter"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Salva Modifiche' : 'Crea Prodotto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
