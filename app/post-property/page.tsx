'use client';

import { useState, useRef, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  UploadCloud,
  X,
  KeyRound,
  Home,
  MapPin,
  FileText,
  IndianRupee,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  CITIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  type ListingType,
  type BHKType,
  type FurnishingType,
  type PropertyCategory,
} from '@/lib/property-data';

const TOTAL_STEPS = 3;

const STEP_META = [
  { label: 'Basic Info', icon: Home },
  { label: 'Location', icon: MapPin },
  { label: 'Photos & Description', icon: ImageIcon },
];

const PROPERTY_CATEGORIES: PropertyCategory[] = [
  'Apartment', 'Villa', 'Independent House', 'Builder Floor', 'Office Space', 'Retail Shop', 'Warehouse',
];

interface FormData {
  listingType: ListingType;
  title: string;
  category: PropertyCategory | undefined;
  bhk: BHKType | undefined;
  furnishing: FurnishingType | undefined;
  price: string;
  city: string | undefined;
  locality: string;
  address: string;
  description: string;
}

export default function PostPropertyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    listingType: 'rent',
    title: '',
    category: undefined,
    bhk: undefined,
    furnishing: undefined,
    price: '',
    city: undefined,
    locality: '',
    address: '',
    description: '',
  });

  const update = (field: keyof FormData, value: string | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const canProceedFromStep = (s: number): boolean => {
    if (s === 0) return !!form.title && !!form.category && !!form.bhk && !!form.furnishing && !!form.price;
    if (s === 1) return !!form.city && !!form.locality && !!form.address;
    return true;
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          title: form.title,
          listing_type: form.listingType,
          category: form.category as string,
          bhk: form.bhk as string,
          furnishing: form.furnishing as string,
          price: parseInt(form.price, 10),
          city: form.city as string,
          locality: form.locality,
          address: form.address,
          description: form.description,
          image_urls: files.map((f) => URL.createObjectURL(f)),
        })
        .select();

      if (error) {
        console.error("Supabase Database Error:", error);
        setSubmitError(error.message);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-6 rounded-full bg-brand-orange/10 p-6">
            <Check className="h-12 w-12 text-brand-orange" />
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal">Property Listed Successfully!</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Your property &ldquo;{form.title}&rdquo; has been submitted for review. Our team will verify and publish it within 24 hours.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="brandOutline" onClick={() => { setSubmitted(false); setSubmitError(null); setStep(0); setForm({ listingType: 'rent', title: '', category: undefined, bhk: undefined, furnishing: undefined, price: '', city: undefined, locality: '', address: '', description: '' }); setFiles([]); }}>
              Post Another Property
            </Button>
            <Button variant="brand" onClick={() => { window.location.href = '/'; }}>
              Go to Home
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <SiteHeader />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-1.5">
            <KeyRound className="h-4 w-4 text-brand-orange" />
            <span className="text-sm font-medium text-brand-orange">100% Free Listing</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-charcoal">Post Your Property</h1>
          <p className="mt-1 text-muted-foreground">Reach thousands of buyers and tenants — no brokerage, no hidden fees</p>
        </div>

        {/* Step Progress */}
        <div className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
          {STEP_META.map((s, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300',
                    i < step && 'bg-brand-orange text-white',
                    i === step && 'bg-brand-orange text-white ring-4 ring-brand-orange/20',
                    i > step && 'bg-secondary text-muted-foreground'
                  )}
                >
                  {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className={cn('text-xs font-medium', i === step ? 'text-brand-charcoal' : 'text-muted-foreground')}>
                  {s.label}
                </span>
              </div>
              {i < STEP_META.length - 1 && (
                <div className={cn('h-0.5 w-8 sm:w-16', i < step ? 'bg-brand-orange' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              {/* Listing Type */}
              <div>
                <Label className="mb-3 block">Listing Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'rent', label: 'Rent' },
                    { value: 'buy', label: 'Sell' },
                    { value: 'commercial', label: 'Commercial' },
                  ] as { value: ListingType; label: string }[]).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => update('listingType', t.value)}
                      className={cn(
                        'rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all',
                        form.listingType === t.value
                          ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                          : 'border-border text-muted-foreground hover:border-brand-orange/30'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. 2 BHK Apartment in Sobha Dream Acres"
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Property Category</Label>
                  <Select value={form.category} onValueChange={(v) => update('category', v as PropertyCategory)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>BHK Size</Label>
                  <Select value={form.bhk} onValueChange={(v) => update('bhk', v as BHKType)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {BHK_OPTIONS.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Furnishing</Label>
                  <Select value={form.furnishing} onValueChange={(v) => update('furnishing', v as FurnishingType)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      {FURNISHING_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">
                    {form.listingType === 'rent' ? 'Monthly Rent' : form.listingType === 'buy' ? 'Sale Price' : 'Lease Amount'}
                  </Label>
                  <div className="relative mt-1.5">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => update('price', e.target.value)}
                      placeholder="25,000"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label>City</Label>
                <Select value={form.city} onValueChange={(v) => update('city', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locality">Locality / Area</Label>
                <Input
                  id="locality"
                  value={form.locality}
                  onChange={(e) => update('locality', e.target.value)}
                  placeholder="e.g. Bellandur, Koramangala"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Building name, street, landmark, pincode..."
                  className="mt-1.5 min-h-[100px]"
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-brand-orange/5 p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-sm text-brand-charcoal/80">
                  Providing an accurate address helps buyers find your property easily. Your exact address is only shared with verified interested parties.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Photos & Description */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="mb-3 block">Upload Photos</Label>
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200',
                    isDragging
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-border hover:border-brand-orange/50 hover:bg-brand-orange/5'
                  )}
                >
                  <div className="mb-3 rounded-full bg-brand-orange/10 p-4">
                    <UploadCloud className="h-8 w-8 text-brand-orange" />
                  </div>
                  <p className="text-sm font-medium text-brand-charcoal">
                    Drag and drop photos here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG up to 5MB each — upload at least 3 photos for better visibility
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Uploaded Files Preview */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {files.map((file, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {files.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">{files.length} photo(s) selected</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe your property — amenities, nearby landmarks, floor number, age of property, special features..."
                  className="mt-1.5 min-h-[120px]"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Tip: Detailed descriptions get up to 3x more enquiries
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Database Error</p>
                <p className="mt-1">{submitError}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className={cn(step === 0 && 'invisible')}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <Button
              variant="brand"
              onClick={handleNext}
              disabled={!canProceedFromStep(step) || isSubmitting}
              className="gap-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {step === TOTAL_STEPS - 1 ? 'Submit Listing' : 'Continue'}
                  {step === TOTAL_STEPS - 1 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-orange" /> No brokerage</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-orange" /> Free listing</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-orange" /> Verified platform</span>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
