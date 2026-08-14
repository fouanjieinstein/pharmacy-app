import type { ProductCategory, ProductGroup } from "@/types";

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  group: ProductGroup;
  description: string;
}

export const categories: CategoryMeta[] = [
  { id: "pain-fever", label: "Pain & Fever Relief", group: "otc", description: "Everyday relief for pain, aches, and fever." },
  { id: "cold-flu", label: "Cold & Flu", group: "otc", description: "Symptom relief for colds, flu, and congestion." },
  { id: "allergy", label: "Allergy Relief", group: "otc", description: "Antihistamines and nasal care for allergy symptoms." },
  { id: "digestive-health", label: "Digestive Health", group: "otc", description: "Support for heartburn, acid reflux, and gut wellness." },
  { id: "skin-care", label: "Skin Care Treatments", group: "otc", description: "Topical care for irritation, acne, and minor skin concerns." },
  { id: "first-aid", label: "First Aid", group: "otc", description: "Wound care, antiseptics, and first-aid essentials." },
  { id: "vitamins-minerals", label: "Vitamins & Minerals", group: "otc", description: "Everyday nutritional supplementation." },
  { id: "womens-health", label: "Women's Health", group: "otc", description: "Products supporting women's health needs." },
  { id: "mens-health", label: "Men's Health", group: "otc", description: "Products supporting men's health needs." },
  { id: "childrens-health", label: "Children's Health", group: "otc", description: "Pediatric-formulated relief and supplements." },
  { id: "cardiovascular", label: "Cardiovascular", group: "prescription", description: "Physician-prescribed heart and blood-pressure medications." },
  { id: "diabetes", label: "Diabetes", group: "prescription", description: "Physician-prescribed blood sugar management medications." },
  { id: "respiratory", label: "Respiratory", group: "prescription", description: "Physician-prescribed asthma and airway medications." },
  { id: "neurology", label: "Neurology", group: "prescription", description: "Physician-prescribed neurological and mental-health medications." },
  { id: "dermatology-rx", label: "Dermatology (Prescription)", group: "prescription", description: "Physician-prescribed treatments for skin conditions." },
  { id: "gastroenterology-rx", label: "Gastroenterology (Prescription)", group: "prescription", description: "Physician-prescribed digestive-condition medications." },
  { id: "autoimmune", label: "Autoimmune Conditions", group: "prescription", description: "Physician-prescribed medications for autoimmune conditions." },
  { id: "oncology", label: "Oncology", group: "prescription", description: "Physician-directed oncology and oncology-support medications." },
  { id: "wellness-supplements", label: "Wellness Supplements", group: "wellness", description: "Everyday nutritional and preventive wellness support." },
  { id: "healthy-aging", label: "Healthy Aging", group: "wellness", description: "Products supporting healthy, active aging." },
  { id: "sexual-wellness", label: "Sexual Wellness", group: "otc", description: "Condoms, lubricants, and sexual health essentials." },
  { id: "medical-devices", label: "Medical Devices", group: "otc", description: "Thermometers, monitors, and home diagnostic equipment." },
  { id: "baby-mother-care", label: "Baby & Mother Care", group: "otc", description: "Diapers, feeding, and maternal care essentials." },
  { id: "oral-care", label: "Oral Care", group: "otc", description: "Toothpaste, mouthwash, and dental hygiene essentials." },
  { id: "eye-ear-care", label: "Eye & Ear Care", group: "otc", description: "Lubricating drops and hygiene care for eyes and ears." },
];

export function getCategoryMeta(id: string): CategoryMeta | undefined {
  return categories.find((c) => c.id === id);
}

export function categoriesByGroup(group: ProductGroup): CategoryMeta[] {
  return categories.filter((c) => c.group === group);
}

export interface Ailment {
  id: string;
  label: string;
  description: string;
  relatedCategories: ProductCategory[];
}

export const ailments: Ailment[] = [
  { id: "headache-pain", label: "Headache & Body Pain", description: "General pain and headache relief options.", relatedCategories: ["pain-fever"] },
  { id: "cold-flu-symptoms", label: "Cold & Flu Symptoms", description: "Congestion, cough, and flu symptom relief.", relatedCategories: ["cold-flu"] },
  { id: "seasonal-allergies", label: "Seasonal Allergies", description: "Sneezing, itchy eyes, and nasal allergy relief.", relatedCategories: ["allergy"] },
  { id: "heartburn-reflux", label: "Heartburn & Acid Reflux", description: "Relief and management for acid-related discomfort.", relatedCategories: ["digestive-health", "gastroenterology-rx"] },
  { id: "skin-irritation", label: "Skin Irritation & Acne", description: "Topical relief for common skin concerns.", relatedCategories: ["skin-care", "dermatology-rx"] },
  { id: "high-blood-pressure", label: "High Blood Pressure", description: "Physician-directed cardiovascular management.", relatedCategories: ["cardiovascular"] },
  { id: "type-2-diabetes", label: "Type 2 Diabetes", description: "Physician-directed blood sugar management.", relatedCategories: ["diabetes"] },
  { id: "asthma-breathing", label: "Asthma & Breathing Difficulty", description: "Physician-directed respiratory management.", relatedCategories: ["respiratory"] },
  { id: "anxiety-mood", label: "Anxiety & Mood Concerns", description: "Physician-directed neurological and mental-health support.", relatedCategories: ["neurology"] },
  { id: "joint-autoimmune", label: "Joint Pain & Autoimmune Conditions", description: "Physician-directed autoimmune condition management.", relatedCategories: ["autoimmune"] },
];
