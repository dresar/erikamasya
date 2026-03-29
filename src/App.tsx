import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicLayout } from "@/components/PublicLayout";
import { AdminLayout } from "@/components/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Structure from "./pages/Structure";
import Activities from "./pages/Activities";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Gallery from "./pages/Gallery";
import Members from "./pages/Members";
import Documents from "./pages/Documents";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogCreate from "./pages/admin/AdminBlogCreate";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminStructure from "./pages/admin/AdminStructure";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminMemberCreate from "./pages/admin/AdminMemberCreate";
import AdminMemberDetail from "./pages/admin/AdminMemberDetail";
import AdminMemberEdit from "./pages/admin/AdminMemberEdit";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/struktur-organisasi" element={<Structure />} />
            <Route path="/kegiatan" element={<Activities />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/anggota" element={<Members />} />
            <Route path="/dokumen" element={<Documents />} />
            <Route path="/kontak" element={<Contact />} />
          </Route>

          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/anggota" element={<AdminMembers />} />
            <Route path="/admin/anggota/new" element={<AdminMemberCreate />} />
            <Route path="/admin/anggota/:id" element={<AdminMemberDetail />} />
            <Route path="/admin/anggota/:id/edit" element={<AdminMemberEdit />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/blog/new" element={<AdminBlogCreate />} />
            <Route path="/admin/blog/:id/edit" element={<AdminBlogEdit />} />
            <Route path="/admin/kegiatan" element={<AdminActivities />} />
            <Route path="/admin/galeri" element={<AdminGallery />} />
            <Route path="/admin/struktur" element={<AdminStructure />} />
            <Route path="/admin/dokumen" element={<AdminDocuments />} />
            <Route path="/admin/pesan" element={<AdminMessages />} />
            <Route path="/admin/pengaturan" element={<AdminSettings />} />
            <Route path="/admin/profil" element={<AdminProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
