import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Kit, KitWritePayload } from '../../../core/models/kit.model';
import { cdnUrl } from '../../../core/utils/cdn-url';
import { apiErrorMessage } from '../../../core/utils/http-error.util';
import { centsToEuro, euroToCents, parseEuroInput } from '../../../core/utils/price.util';
import { isValidSlug, slugify } from '../../../core/utils/slug.util';
import { AdminKitService } from '../../../data/admin-kit.service';
import { FitmentService } from '../../../data/fitment.service';
import { UploadService } from '../../../data/upload.service';

@Component({
  selector: 'app-kit-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './kit-form.component.html',
})
export class KitFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly kitService = inject(AdminKitService);
  private readonly uploadService = inject(UploadService);
  private readonly fitmentService = inject(FitmentService);

  readonly kitId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly uploading = signal(false);
  readonly error = signal('');
  readonly makes = signal<string[]>([]);

  images: string[] = [];
  slugTouched = false;

  readonly form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    featured: [false],
    fitments: this.fb.array<FormGroup>([]),
    variants: this.fb.array<FormGroup>([]),
    includes: this.fb.array<FormGroup>([]),
  });

  get fitments(): FormArray<FormGroup> {
    return this.form.controls.fitments;
  }

  get variants(): FormArray<FormGroup> {
    return this.form.controls.variants;
  }

  get includes(): FormArray<FormGroup> {
    return this.form.controls.includes;
  }

  get isEdit(): boolean {
    return !!this.kitId();
  }

  ngOnInit(): void {
    this.fitmentService.getMakes().subscribe((m) => this.makes.set(m));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.kitId.set(id);
      this.loadKit(id);
    } else {
      this.addFitment();
      this.addVariant();
      this.addInclude();
    }
    this.form.controls.name.valueChanges.subscribe((name) => {
      if (!this.slugTouched && name) {
        this.form.controls.slug.setValue(slugify(name));
      }
    });
  }

  imageUrl(key: string): string {
    return cdnUrl(key);
  }

  onSlugInput(): void {
    this.slugTouched = true;
  }

  addFitment(): void {
    this.fitments.push(
      this.fb.group({
        make: ['', Validators.required],
        model: ['', Validators.required],
        yearFrom: [new Date().getFullYear(), Validators.required],
        yearTo: [new Date().getFullYear(), Validators.required],
      }),
    );
  }

  removeFitment(index: number): void {
    this.fitments.removeAt(index);
  }

  addVariant(): void {
    this.variants.push(
      this.fb.group({
        id: [''],
        label: ['', Validators.required],
        sku: ['', Validators.required],
        priceEuro: ['', Validators.required],
        colorHex: ['#e11d48'],
      }),
    );
  }

  removeVariant(index: number): void {
    if (this.variants.length <= 1) {
      return;
    }
    this.variants.removeAt(index);
  }

  addInclude(): void {
    this.includes.push(this.fb.group({ value: [''] }));
  }

  removeInclude(index: number): void {
    this.includes.removeAt(index);
  }

  moveImage(index: number, direction: -1 | 1): void {
    const next = index + direction;
    if (next < 0 || next >= this.images.length) {
      return;
    }
    const copy = [...this.images];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    this.images = copy;
  }

  removeImage(index: number): void {
    this.images = this.images.filter((_, i) => i !== index);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    const slug = this.form.controls.slug.value?.trim();
    if (!slug || !isValidSlug(slug)) {
      this.error.set('Définissez un slug valide avant d’uploader une image.');
      return;
    }
    this.uploading.set(true);
    this.error.set('');
    this.uploadService.presign(slug, file).subscribe({
      next: (key) => {
        this.images = [...this.images, key];
        this.uploading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err, 'Échec de l’upload'));
        this.uploading.set(false);
      },
    });
  }

  save(): void {
    this.error.set('');
    if (!this.validateClient()) {
      return;
    }
    const payload = this.buildPayload();
    this.saving.set(true);
    const request = this.isEdit
      ? this.kitService.update(this.kitId()!, payload)
      : this.kitService.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/kits']);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(err, 'Enregistrement impossible'));
      },
    });
  }

  deleteKit(): void {
    const id = this.kitId();
    if (!id || !confirm('Supprimer ce kit définitivement ?')) {
      return;
    }
    this.kitService.delete(id).subscribe({
      next: () => void this.router.navigate(['/kits']),
      error: (err) => this.error.set(apiErrorMessage(err, 'Suppression impossible')),
    });
  }

  cancel(): void {
    void this.router.navigate(['/kits']);
  }

  private loadKit(id: string): void {
    this.loading.set(true);
    this.kitService.getById(id).subscribe({
      next: (kit) => {
        this.patchKit(kit);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err, 'Kit introuvable'));
        this.loading.set(false);
      },
    });
  }

  private patchKit(kit: Kit): void {
    this.images = [...kit.images];
    this.slugTouched = true;
    this.form.patchValue(
      {
        name: kit.name,
        slug: kit.slug,
        shortDescription: kit.shortDescription,
        description: kit.description,
        featured: !!kit.featured,
      },
      { emitEvent: false },
    );
    this.fitments.clear();
    kit.fitments.forEach((f) =>
      this.fitments.push(
        this.fb.group({
          make: [f.make, Validators.required],
          model: [f.model, Validators.required],
          yearFrom: [f.yearFrom, Validators.required],
          yearTo: [f.yearTo, Validators.required],
        }),
      ),
    );
    this.variants.clear();
    kit.variants.forEach((v) =>
      this.variants.push(
        this.fb.group({
          id: [v.id],
          label: [v.label, Validators.required],
          sku: [v.sku, Validators.required],
          priceEuro: [centsToEuro(v.priceCents).toFixed(2), Validators.required],
          colorHex: [v.colorHex ?? '#e11d48'],
        }),
      ),
    );
    this.includes.clear();
    (kit.includes.length ? kit.includes : ['']).forEach((item) =>
      this.includes.push(this.fb.group({ value: [item] })),
    );
  }

  private validateClient(): boolean {
    this.form.markAllAsTouched();
    const slug = this.form.controls.slug.value?.trim() ?? '';
    if (!this.form.controls.name.value?.trim()) {
      this.error.set('Le nom est obligatoire.');
      return false;
    }
    if (!isValidSlug(slug)) {
      this.error.set('Slug invalide (ex. mon-kit-2024).');
      return false;
    }
    if (this.variants.length < 1) {
      this.error.set('Au moins une variante est requise.');
      return false;
    }
    for (let i = 0; i < this.fitments.length; i++) {
      const row = this.fitments.at(i).value;
      if (row.yearFrom > row.yearTo) {
        this.error.set(`Fitment ${i + 1} : yearFrom doit être ≤ yearTo.`);
        return false;
      }
    }
    for (let i = 0; i < this.variants.length; i++) {
      const euro = parseEuroInput(String(this.variants.at(i).value.priceEuro ?? ''));
      if (euro == null || euro <= 0) {
        this.error.set(`Variante ${i + 1} : prix invalide.`);
        return false;
      }
    }
    if (this.form.invalid) {
      this.error.set('Vérifiez les champs obligatoires.');
      return false;
    }
    return true;
  }

  private buildPayload(): KitWritePayload {
    const raw = this.form.getRawValue();
    return {
      slug: raw.slug!.trim(),
      name: raw.name!.trim(),
      shortDescription: raw.shortDescription!.trim(),
      description: raw.description!.trim(),
      images: [...this.images],
      featured: !!raw.featured,
      fitments: this.fitments.controls.map((g) => {
        const v = g.getRawValue();
        return {
          make: v.make.trim(),
          model: v.model.trim(),
          yearFrom: Number(v.yearFrom),
          yearTo: Number(v.yearTo),
        };
      }),
      variants: this.variants.controls.map((g) => {
        const v = g.getRawValue();
        const euro = parseEuroInput(String(v.priceEuro)) ?? 0;
        return {
          id: v.id || undefined,
          label: v.label.trim(),
          sku: v.sku.trim(),
          priceCents: euroToCents(euro),
          colorHex: v.colorHex || undefined,
        };
      }),
      includes: this.includes.controls
        .map((g) => (g.getRawValue().value as string).trim())
        .filter(Boolean),
    };
  }
}
