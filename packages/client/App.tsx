import React, { useState } from "react";
import MainPage from "./pages/MainPage";
import NavBar from "./components/layout/NavBar";
import PageLayout from "./components/layout/PageLayout";
import { Pages } from "@client/types";
import RepositoryProvider from "./contexts/RepositoryContext";

function App() {
  const [currentPage, setCurrentPage] = useState(Pages.JOURNAL);

  function handlePageChange(page: string) {
    setCurrentPage(page);
  }

  return (
    <PageLayout>
      <NavBar activeLink={currentPage} onChange={handlePageChange} />
      <RepositoryProvider>
        <MainPage activeLink={currentPage} />
      </RepositoryProvider>
    </PageLayout>
  );
}

export default App;
