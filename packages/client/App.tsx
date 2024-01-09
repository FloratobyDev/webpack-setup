import React, { useState } from "react";
import MainPage from "./pages/MainPage";
import NavBar from "./components/layout/NavBar";
import PageLayout from "./components/layout/PageLayout";
import { Pages } from "@client/types";

function App() {
  const [currentPage, setCurrentPage] = useState(Pages.JOURNAL);

  function handlePageChange(page: string) {
    setCurrentPage(page);
  }

  return (
    <PageLayout>
      <NavBar activeLink={currentPage} onChange={handlePageChange} />
      <MainPage activeLink={currentPage} />
    </PageLayout>
  );
}

export default App;
