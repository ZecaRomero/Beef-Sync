import { useState } from 'react'
import Layout from '../components/Layout'
import ReproductionManager from '../components/ReproductionManager'

export default function ReproductionPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ReproductionManager />
      </div>
    </Layout>
  )
}