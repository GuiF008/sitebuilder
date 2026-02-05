import { z } from 'zod'

/**
 * Schémas de validation Zod pour les API
 */

// Création de site
export const createSiteSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  contactEmail: z.string().email('Email invalide'),
  goal: z.enum(['vitrine', 'portfolio', 'blog', 'ecommerce'], {
    message: 'Objectif invalide',
  }),
  themeFamily: z.string().min(1, 'Thème requis'),
  sections: z.array(z.string()).default([]),
  needs: z.array(z.string()).default([]),
})

// Création de page
export const createPageSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre est trop long'),
})

// Mise à jour de page
export const updatePageSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  order: z.number().int().optional(),
  isHome: z.boolean().optional(),
  showInMenu: z.boolean().optional(),
})

// Mise à jour de section
export const updateSectionSchema = z.object({
  type: z.string().optional(),
  dataJson: z.string().optional(),
  order: z.number().int().optional(),
})

// Styles de section
export const sectionStylesSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  headingColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  buttonStyle: z.enum(['square', 'rounded', 'pill']).optional(),
})

// Mise à jour de thème
export const updateThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  borderRadius: z.string().optional(),
  buttonStyle: z.enum(['square', 'rounded', 'pill']).optional(),
})

// Types inférés
export type CreateSiteInput = z.infer<typeof createSiteSchema>
export type CreatePageInput = z.infer<typeof createPageSchema>
export type UpdatePageInput = z.infer<typeof updatePageSchema>
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>
export type SectionStylesInput = z.infer<typeof sectionStylesSchema>
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>
