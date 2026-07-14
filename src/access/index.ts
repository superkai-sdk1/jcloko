import type { Access, FieldAccess } from 'payload'

/** Роли пользователей CMS. */
export type Role = 'admin' | 'editor' | 'coach'

const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role

const idOf = (user: unknown): string | number | undefined =>
  (user as { id?: string | number } | null | undefined)?.id

/** Публичный доступ (для чтения витрины). */
export const anyone: Access = () => true

/** Любой залогиненный пользователь CMS. */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Только администратор. */
export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

/** Администратор или редактор. */
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}

/** Field-level: правку разрешаем только администратору (например, смена роли). */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => roleOf(user) === 'admin'

/**
 * Чтение опубликованного контента: витрина видит только `status: published`,
 * залогиненные редакторы/админы — всё (включая черновики).
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    status: {
      equals: 'published',
    },
  }
}

/**
 * Ограничение для тренера: полный доступ у admin/editor, тренер — только свои
 * записи по указанному пути до владельца (например `user` или `coach.user`).
 */
export const adminEditorOrOwner =
  (ownerPath: string): Access =>
  ({ req: { user } }) => {
    if (!user) return false
    const role = roleOf(user)
    if (role === 'admin' || role === 'editor') return true
    if (role === 'coach') {
      return {
        [ownerPath]: {
          equals: idOf(user),
        },
      }
    }
    return false
  }
