'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Loader2, User, Building, MapPin, Hash, Mail, Phone, StickyNote, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const clienteSchema = z.object({
  ragioneSociale: z.string().min(1, 'Ragione sociale obbligatoria'),
  indirizzo: z.string().optional().or(z.literal('')),
  cap: z.string().optional().or(z.literal('')),
  citta: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')).refine(val => !val || val.length <= 5, 'Max 5 caratteri'),
  piva: z.string().optional().or(z.literal('')),
  cf: z.string().optional().or(z.literal('')),
  email: z.string().email('Email non valida').optional().or(z.literal('')),
  pec: z.string().email('PEC non valida').optional().or(z.literal('')),
  codiceUnivoco: z.string().optional().or(z.literal('')),
  indirizzoSpedizione: z.string().optional().or(z.literal('')),
  capSpedizione: z.string().optional().or(z.literal('')),
  cittaSpedizione: z.string().optional().or(z.literal('')),
  provinciaSpedizione: z.string().optional().or(z.literal('')),
  note: z.string().optional().or(z.literal('')),
})

type ClienteForm = z.infer<typeof clienteSchema>

export default function ClienteForm({ params }: { params?: { id?: string } }) {
  const router = useRouter()
  const isEdit = !!params?.id
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
  })

  useEffect(() => {
    if (isEdit && params?.id) {
      fetchCliente()
    }
  }, [isEdit, params?.id])

  const fetchCliente = async () => {
    try {
      const res = await fetch(`/api/clienti/${params?.id}`)
      if (res.ok) {
        const data = await res.json()
        reset({
          ...data,
          pec: data.pec || '',
          codiceUnivoco: data.codiceUnivoco || '',
        })
      } else {
        router.push('/clienti')
      }
    } catch (error) {
      console.error('Error fetching cliente:', error)
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (data: ClienteForm) => {
    setLoading(true)
    try {
      const url = isEdit ? `/api/clienti/${params.id}` : '/api/clienti'
      const method = isEdit ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/clienti')
        router.refresh()
      }
    } catch (error) {
      console.error('Error saving cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium">Caricamento dati cliente...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-4">
        <Link
          href="/clienti"
          className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-200 text-slate-400 hover:text-indigo-600 hover:ring-indigo-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? 'Modifica Cliente' : 'Nuovo Cliente'}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit ? 'Aggiorna le informazioni dell\'anagrafica' : 'Registra un nuovo cliente nel sistema'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Info Section */}
        <div className="card p-6 md:p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">
            <Building className="w-4 h-4" />
            Dati Aziendali
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Ragione Sociale <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  {...register('ragioneSociale')}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-slate-900 transition-all focus:bg-white",
                    errors.ragioneSociale ? "border-red-500 focus:ring-red-50" : "border-slate-200 focus:border-indigo-500"
                  )}
                  placeholder="Es. Horus Srl"
                />
              </div>
              {errors.ragioneSociale && <p className="text-xs text-red-500 mt-1 ml-1">{errors.ragioneSociale.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Partita IVA</label>
              <input
                {...register('piva')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="00000000000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Codice Fiscale</label>
              <input
                {...register('cf')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="ABCXYZ00A01H000X"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">PEC</label>
              <input
                {...register('pec')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="amministrazione@pec.it"
              />
              {errors.pec && <p className="text-xs text-red-500 mt-1 ml-1">{errors.pec.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Codice Univoco (SDI)</label>
              <input
                {...register('codiceUnivoco')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500 uppercase"
                placeholder="XXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* address info */}
        <div className="card p-6 md:p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              Indirizzo di Sede
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Indirizzo</label>
              <input
                {...register('indirizzo')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="Via Roma, 1"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">CAP</label>
              <input
                {...register('cap')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="00100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Città</label>
              <input
                {...register('citta')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="Roma"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Provincia</label>
              <input
                {...register('provincia')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500 uppercase"
                placeholder="RM"
                maxLength={5}
              />
            </div>
          </div>
        </div>

        {/* shipping address info */}
        <div className="card p-6 md:p-8 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              Indirizzo di Spedizione
            </div>
            <button
              type="button"
              onClick={() => {
                const values = watch()
                setValue('indirizzoSpedizione', values.indirizzo)
                setValue('capSpedizione', values.cap)
                setValue('cittaSpedizione', values.citta)
                setValue('provinciaSpedizione', values.provincia)
              }}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors"
            >
              COPIA DA SEDE PRINCIPALE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Indirizzo di Spedizione</label>
              <input
                {...register('indirizzoSpedizione')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="Via Milano, 20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">CAP</label>
              <input
                {...register('capSpedizione')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="20100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Città</label>
              <input
                {...register('cittaSpedizione')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                placeholder="Milano"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Provincia</label>
              <input
                {...register('provinciaSpedizione')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500 uppercase"
                placeholder="MI"
                maxLength={5}
              />
            </div>
          </div>
        </div>

        {/* contact info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-4">
             <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">
                <Phone className="w-4 h-4" />
                Contatti
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
                  <input
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                    placeholder="esempio@dominio.it"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Telefono</label>
                  <input
                    {...register('telefono')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500"
                    placeholder="+39 000 0000000"
                  />
                </div>
              </div>
          </div>

          <div className="card p-6 bg-white shadow-lg ring-1 ring-slate-200 rounded-3xl space-y-4">
             <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">
                <StickyNote className="w-4 h-4" />
                Note
              </div>
              <textarea
                {...register('note')}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all focus:border-indigo-500 resize-none text-sm"
                placeholder="Eventuali annotazioni sul cliente..."
              />
          </div>
        </div>

        {/* submit buttons */}
        <div className="flex items-center justify-end gap-4 pb-12">
          <Link
            href="/clienti"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all font-inter"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Salva Modifiche' : 'Crea Cliente'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
