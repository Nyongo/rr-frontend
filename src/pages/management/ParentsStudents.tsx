import Layout from "@/components/Layout";
import { useParentActions } from "@/components/parents/hooks/useParentActions";
import { ParentsStats } from "@/components/parents/components/ParentsStats";
import { ParentDialogs } from "@/components/parents/components/ParentDialogs";
import { ParentStatusDialogs } from "@/components/parents/components/ParentStatusDialogs";
import { ParentsPageHeader } from "@/components/parents/components/ParentsPageHeader";
import { ParentsTabContent } from "@/components/parents/components/ParentsTabContent";
import { useState, useEffect, useMemo } from "react";
import { useStudents } from "@/hooks/useStudents";

const ParentsStudents = () => {
  const [activeTab, setActiveTab] = useState("parents");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    // Data
    parents,
    loading: parentsLoading,
    newItem,
    setNewItem,
    editingItem,
    itemToDelete,

    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isImportDialogOpen,
    setIsImportDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isStatusWarningOpen,
    isActivateWarningOpen,

    // Actions
    handleAddDialogOpen,
    handleAddParent,
    handleEditItem,
    handleUpdateItem,
    handleDeleteItem,
    confirmDelete,
    handleImport,
    handleParentClick,
    handleRowClick,
    handleConfirmStatusChange,
    handleConfirmActivateChange,
    handleCancelActivateChange,
    handleCancelStatusChange,
    refetch: refetchParents,
  } = useParentActions();

  // Fetch all students to calculate accurate counts
  const { students, fetchStudents } = useStudents();

  useEffect(() => {
    // Fetch all students to calculate accurate counts
    fetchStudents(1, 1000); // Fetch all students (large page size)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  // Calculate student counts per parent
  const parentsWithStudentCounts = useMemo(() => {
    return parents.map((parent) => {
      const studentCount = students.filter(
        (student) => student.parentId === parent.id
      ).length;
      return {
        ...parent,
        studentsCount: studentCount,
      };
    });
  }, [parents, students]);

  // Calculate total students count
  const totalStudentsCount = useMemo(() => {
    return students.length;
  }, [students]);

  const filteredParents = parentsWithStudentCounts.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parent.email &&
        parent.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (parent.phoneNumber &&
        parent.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (parent.phone &&
        parent.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      parent.parentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parent.school?.name &&
        parent.school.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirmStatusChangeAndClose = () => {
    handleConfirmStatusChange();
    setIsEditDialogOpen(false);
  };

  const handleConfirmActivateChangeAndClose = () => {
    handleConfirmActivateChange();
    setIsEditDialogOpen(false);
  };

  // Handle successful parent addition - refetch students to update counts
  const handleAddParentWithRefresh = async (e: React.FormEvent) => {
    await handleAddParent(e);
    // Refetch students to update counts (parents are already refetched in handleAddParent)
    await fetchStudents(1, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <ParentsPageHeader
          onAddParent={handleAddDialogOpen}
          isImportDialogOpen={isImportDialogOpen}
          setIsImportDialogOpen={setIsImportDialogOpen}
          onImportSuccess={async () => {
            await refetchParents();
            await fetchStudents(1, 1000);
          }}
        />

        {/* Stats Cards */}
        <ParentsStats parents={parentsWithStudentCounts} totalStudents={totalStudentsCount} />

        {/* Tab Content */}
        <ParentsTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredParents={filteredParents}
          loading={parentsLoading}
          onEditParent={handleEditItem}
          onDeleteParent={handleDeleteItem}
          onParentClick={handleParentClick}
          onRowClick={handleRowClick}
          onAddParent={handleAddDialogOpen}
          onImportParents={() => setIsImportDialogOpen(true)}
        />

        {/* Main Dialogs */}
        <ParentDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isImportDialogOpen={false}
          setIsImportDialogOpen={setIsImportDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          editingItem={editingItem}
          itemToDelete={itemToDelete}
          onAddParent={handleAddParentWithRefresh}
          onUpdateParent={handleUpdateItem}
          onConfirmDelete={confirmDelete}
          onImport={handleImport}
        />

        {/* Status Change Warning Dialogs */}
        <ParentStatusDialogs
          isStatusWarningOpen={isStatusWarningOpen}
          isActivateWarningOpen={isActivateWarningOpen}
          onConfirmStatusChange={handleConfirmStatusChangeAndClose}
          onConfirmActivateChange={handleConfirmActivateChangeAndClose}
          onCancelStatusChange={handleCancelStatusChange}
          onCancelActivateChange={handleCancelActivateChange}
        />
      </div>
    </Layout>
  );
};

export default ParentsStudents;
