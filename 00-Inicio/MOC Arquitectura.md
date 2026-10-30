---
tipo: "moc"
tags:
  - "moc"
actualizado: "2026-10-30"
---

# 🏛️ Arquitectura

Visión del sistema, capas, decisiones (ADR), flujos de punta a punta y los paquetes compartidos (`contracts`, `domain`, `config`).

↑ [[Inicio]]

## (raíz)

- [[Arquitectura general]]
- [[Monorepo pnpm]]

## ADR

- [[ADR-01 - Jobs con cron externo]]
- [[ADR-02 - Sesión entre dominios (proxy de Vercel)]]
- [[ADR-03 - Dinero como decimal]]
- [[ADR-04 - Libro contable de doble asiento]]
- [[ADR-05 - Aislamiento por usuario]]
- [[ADR-06 - Fuentes de tasas de cambio]]
- [[ADR-07 - Deshacer con token]]
- [[ADR-08 - Autenticación sobre Better Auth]]
- [[ADR-09 - Errores problem+json]]
- [[ADR-10 - Esquema Prisma más SQL]]
- [[ADR-11 - Idempotencia con UUID v7]]
- [[ADR-12 - Datos de mercado globales]]
- [[ADR-13 - Estados derivados al leer]]
- [[ADR-14 - Interés de deudas como foto]]
- [[ADR-15 - Nombres de tablas del libro]]
- [[ADR-16 - Navegación con React Router]]
- [[ADR-17 - Estado de cliente mínimo]]
- [[ADR-18 - Entregas con RELEASE]]
- [[ADR-19 - Backend en capas]]
- [[ADR-20 - CI-CD con GitHub Actions]]

## Configuración

- [[Config - dependency-cruiser]]
- [[Config - eslint compartido]]
- [[Config - packages config package.json]]
- [[Config - tsconfig.base.json]]
- [[Config - vitest.base.ts]]

## Flujos

- [[Flujo - Autenticación y sesión]]
- [[Flujo - Guardar un gasto]]
- [[Flujo - Petición HTTP en el API]]
- [[Flujo - Tick de jobs]]
- [[Flujo - Tipo de cambio]]

## Paquetes

- [[Paquete config]]
- [[Paquete contracts]]
- [[Paquete db]]
- [[Paquete domain]]

## Paquetes › contracts

- [[Contrato - accounts]]
- [[Contrato - auth]]
- [[Contrato - budgets]]
- [[Contrato - catalogs]]
- [[Contrato - categories]]
- [[Contrato - common]]
- [[Contrato - dashboard]]
- [[Contrato - debts]]
- [[Contrato - errors]]
- [[Contrato - fx]]
- [[Contrato - goals]]
- [[Contrato - notifications]]
- [[Contrato - onboarding]]
- [[Contrato - recurring]]
- [[Contrato - register]]
- [[Contrato - releases]]
- [[Contrato - settings]]
- [[Contrato - transactions]]

## Paquetes › domain

- [[Dominio - balance]]
- [[Dominio - budget]]
- [[Dominio - dashboard]]
- [[Dominio - dates]]
- [[Dominio - debts]]
- [[Dominio - format]]
- [[Dominio - fx]]
- [[Dominio - goals]]
- [[Dominio - money]]
- [[Dominio - recurrence]]

## Plan

- [[Plan 1. Visión Arquitectónica y Flujo del Sistema]]
- [[Plan 1.1 Capas]]
- [[Plan 1.2 Despliegue y flujo principal]]
- [[Plan 1.3 Registro de decisiones (ADR)]]
- [[Plan 1.4 Arquitectura por capas del backend (ADR-19)]]
- [[Plan 1.5 Integración y despliegue continuos (ADR-20)]]
- [[Plan 2. Estructura del Proyecto (Árbol de Directorios)]]

## README

- [[README - Estructura]]
- [[README - Stack]]


