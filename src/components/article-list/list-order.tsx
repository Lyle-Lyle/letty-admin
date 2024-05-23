import type { FC } from 'react'
import { useLoaderData } from 'react-router-dom'

const ListOrder: FC<{ index: number }> = ({ index }) => {
  const loaderData = useLoaderData() as { q: ArtListQuery } | null
  return loaderData && (loaderData.q.pagenum - 1) * loaderData.q.pagesize + index + 1
}

export default ListOrder
