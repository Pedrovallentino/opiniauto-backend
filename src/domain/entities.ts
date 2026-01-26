/**
 * @module DomainEntities
 * @description Centralização das definições de tipos das entidades do domínio.
 * Reexporta os tipos gerados pelo Prisma Client para desacoplar (parcialmente) o código do ORM.
 * 
 * @requires @prisma/client
 */

import { Avaliacao, Carro, Usuario } from '@prisma/client'

/** @typedef {Usuario} User - Entidade de Usuário */
export type User = Usuario

/** @typedef {Carro} Car - Entidade de Carro */
export type Car = Carro

/** @typedef {Avaliacao} Evaluation - Entidade de Avaliação */
export type Evaluation = Avaliacao

