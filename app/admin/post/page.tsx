'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  UploadCloud,
  X,
  Home,
  MapPin,
  IndianRupee,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { AdminGate } from '@/components/admin-gate';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  type BHKType,
  type FurnishingType,
  type PropertyCategory,
} from '@/lib/property-data';
import {
  ALLOWED_PHOTO_TYPES,
  COMMERCIAL_CATEGORIES,
  LISTING_BUCKET,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  listingSchema,
  toFurnishingValue,
  toSlug,
} from '@/lib/listing-schema';

const TOTAL_STEPS = 3;

const STEP_META = [
  { label: 'Basic Info', icon: Home },
  { label: 'Location', icon: MapPin },
  { label: 'Photos & Description', icon: ImageIcon },
];

const PROPERTY_CATEGORIES: PropertyCategory[] = [
  'Apartment',
  'Villa',
  'Independent House',
  'Builder Floor',
  'Office Space',
  'Retail Shop',
  'Warehouse',
];

type PostType = 'rent' | 'sale';

interface FormData {
  listingType: PostType;
  title: string;
  category: PropertyCategory | undefined;
  bhk: BHKType | undefined;
  furnishing: FurnishingType | undefined;
  price: string;
  city: string | undefined;
  locality: string;
  address: string;
  description: string;
  publish: boolean;
}

const EMPTY_FORM: FormData = {
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
  publish: true,
};

interface Photo {
  file: File;
  url: string;
}

function parseBhk(value: string): number | null {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

export default function AdminPostPage() {
  return <AdminGate>{(userId) => <PostForm userId={userId} />}</AdminGate>;
}

function PostForm({ userId }: { userId: string }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [savedStatus, setSavedStatus] = useState<'active' | 'draft'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const inputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<Photo[]>([]);

  // Free preview URLs when leaving the page
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isCommercial = form.category
    ? COMMERCIAL_CATEGORIES.includes(toSlug(form.category))
    : false;

  const addFiles = useCallback((incoming: File[]) => {
    const next = [...photosRef.current];
    let error: string | null = null;

    for (const file of incoming) {
      if (!ALLOWED_PHOTO_TYPES[file.type]) {
        error = `${file.name}: only JPG, PNG or WebP photos are allowed.`;
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        error = `${file.name} is larger than 5 MB.`;
        continue;
      }
      if (next.length >= MAX_PHOTOS) {
        error = `You can add up to ${MAX_PHOTOS} photos.`;
        break;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    }

    photosRef.current = next;
    setPhotos(next);
    setPhotoError(error);
  }, []);

  const removePhoto = (idx: number) => {
    const target = photosRef.current[idx];
    if (target) URL.revokeObjectURL(target.url);
    const next = photosRef.current.filter((_, i) => i !== idx);
    photosRef.current = next;
    setPhotos(next);
    setPhotoError(null);
  };

  const resetForm = () => {
    photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    photosRef.current = [];
    setPhotos([]);
    setForm(EMPTY_FORM);
    setStep(0);
    setSubmitError(null);
    setPhotoError(null);
    setSubmitted(false);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const canProceedFromStep = (s: number): boolean => {
    if (s === 0) {
      const base =
        form.title.trim().length >= 5 &&
        !!form.category &&
        Number(form.price) > 0;
      return base && (isCommercial || (!!form.bhk && !!form.furnishing));
    }
    if (s === 1) return !!form.city && !!form.locality.trim() && !!form.address.trim();
    return true;
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    const uploadedPaths: string[] = [];

    try {
      const parsed = listingSchema.safeParse({
        title: form.title,
        listing_type: form.listingType,
        category: form.category ? toSlug(form.category) : undefined,
        bhk_size: isCommercial || !form.bhk ? null : parseBhk(form.bhk),
        furnishing: form.furnishing ? toFurnishingValue(form.furnishing) : null,
        price: Math.round(Number(form.price)),
        city: form.city ?? '',
        locality: form.locality,
        address: form.address,
        description: form.description.trim() === '' ? null : form.description,
        status: form.publish ? 'active' : 'draft',
      });

      if (!parsed.success) {
        setSubmitError(parsed.error.issues[0].message);
        return;
      }

      // 1. Upload photos to storage under a folder named after the listing id
      const id = crypto.randomUUID();
      for (const photo of photosRef.current) {
        const ext = ALLOWED_PHOTO_TYPES[photo.file.type];
        const path = `${id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(LISTING_BUCKET)
          .upload(path, photo.file, {
            contentType: photo.file.type,
            cacheControl: '31536000',
          });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
      }

      const images = uploadedPaths.map(
        (p) => supabase.storage.from(LISTING_BUCKET).getPublicUrl(p).data.publicUrl
      );

      // 2. Save the listing
      const { error } = await supabase
        .from('listings')
        .insert({ id, owner_id: userId, ...parsed.data, images });

      if (error) throw error;

      setSavedStatus(parsed.data.status);
      setSubmitted(true);
    } catch (err) {
      // Remove photos that were uploaded before the failure
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(LISTING_BUCKET).remove(uploadedPaths);
      }
      console.error('Listing save failed:', err);
      setSubmitError(
        err instanceof Error && err.message
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
          <h1 className="text-3xl font-bold text-brand-charcoal">
            {savedStatus === 'active' ? 'Listing published' : 'Draft saved'}
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            &ldquo;{form.title}&rdquo;{' '}
            {savedStatus === 'active'
              ? 'is now live on the site.'
              : 'is saved as a draft. Publish it from Manage listings when it is ready.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="brandOutline" onClick={resetForm}>
              Post another property
            </Button>
            <Button variant="brand" onClick={() => { window.location.href = '/admin/listings'; }}>
              Manage listings
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
          <h1 className="text-3xl font-bold text-brand-charcoal">Post a property</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details, add photos, then publish or save as a draft.
          </p>
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
                <span
                  className={cn(
                    'text-xs font-medium',
                    i === step ? 'text-brand-charcoal' : 'text-muted-foreground'
                  )}
                >
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
              <div>
                <Label className="mb-3 block">Listing type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'rent', label: 'Rent' },
                    { value: 'sale', label: 'Sell' },
                  ] as { value: PostType; label: string }[]).map((t) => (
                    <button
                      key={t.value}
                      type="button"
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
                <Label htmlFor="title">Property title</Label>
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
                  <Label>Property category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => update('category', v as PropertyCategory)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!isCommercial && (
                  <div>
                    <Label>BHK size</Label>
                    <Select
                      value={form.bhk}
                      onValueChange={(v) => update('bhk', v as BHKType)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select BHK" />
                      </SelectTrigger>
                      <SelectContent>
                        {BHK_OPTIONS.filter((b) => b.includes('BHK')).map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Furnishing</Label>
                  <Select
                    value={form.furnishing}
                    onValueChange={(v) => update('furnishing', v as FurnishingType)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select furnishing" />
                    </SelectTrigger>
                    <SelectContent>
                      {FURNISHING_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">
                    {form.listingType === 'rent' ? 'Monthly rent' : 'Sale price'}
                  </Label>
                  <div className="relative mt-1.5">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min={1}
                      value={form.price}
                      onChange={(e) => update('price', e.target.value)}
                      placeholder="25000"
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
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locality">Locality / area</Label>
                <Input
                  id="locality"
                  value={form.locality}
                  onChange={(e) => update('locality', e.target.value)}
                  placeholder="e.g. Bellandur, Koramangala"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="address">Full address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Building name, street, landmark, pincode"
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Photos & Description */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="mb-3 block">Photos</Label>
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
                    Drag photos here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or WebP, up to 5 MB each, maximum {MAX_PHOTOS} photos
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {photoError && (
                  <p className="mt-2 text-sm text-destructive">{photoError}</p>
                )}

                {photos.length > 0 && (
                  <>
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {photos.map((photo, idx) => (
                        <div
                          key={photo.url}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt={photo.file.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            aria-label={`Remove ${photo.file.name}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(idx);
                            }}
                            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {photos.length} photo(s) selected. The first photo is the cover.
                    </p>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Amenities, nearby landmarks, floor number, age of property, special features"
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4">
                <input
                  type="checkbox"
                  checked={form.publish}
                  onChange={(e) => update('publish', e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#FF6624]"
                />
                <span className="text-sm text-brand-charcoal">
                  <span className="font-medium">Publish immediately</span>
                  <span className="block text-muted-foreground">
                    Untick to save as a draft that visitors cannot see.
                  </span>
                </span>
              </label>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Could not save the listing</p>
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
                  Saving...
                </>
              ) : (
                <>
                  {step === TOTAL_STEPS - 1
                    ? form.publish
                      ? 'Publish listing'
                      : 'Save draft'
                    : 'Continue'}
                  {step === TOTAL_STEPS - 1 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
