import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Landing from './Landing'
import DocsLayout from './pages/DocsLayout'
import GetStarted from './pages/docs/GetStarted'
import Editor from './pages/docs/Editor'
import Themes from './pages/docs/Themes'
import Fonts from './pages/docs/Fonts'
import ExportTemplate from './pages/docs/ExportTemplate'
import CustomCss from './pages/docs/CustomCss'
import Vault from './pages/docs/Vault'
import Privacy from './pages/Privacy'
import Changelog from './pages/Changelog'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="docs" element={<DocsLayout />}>
            <Route index element={<Navigate to="get-started" replace />} />
            <Route path="get-started" element={<GetStarted />} />
            <Route path="editor" element={<Editor />} />
            <Route path="vault" element={<Vault />} />
            <Route path="themes" element={<Themes />} />
            <Route path="fonts" element={<Fonts />} />
            <Route path="export-template" element={<ExportTemplate />} />
            <Route path="custom-css" element={<CustomCss />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
