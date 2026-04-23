"use client";

import { useMemo, useState } from "react";
import { incomeStyles } from "@/styles/income";


type CategoryType = "expense" | "savings" | "credit/debt";
type SortOption =
  | "name-asc"
  | "name-desc"
  | "type"
  | "total-high-low"
  | "total-low-high";

type Allocation = {
  id: string;
  name: string;
  amount: number;
};

type Category = {
  id: string;
  name: string;
  type: CategoryType;
  allocations: Allocation[];
};

type AllocationManagementProps = {
  totalIncome: number;
};

const categoryTypeOptions: { value: CategoryType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "savings", label: "Savings" },
  { value: "credit/debt", label: "Credit/Debt" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getCategoryTotal(category: Category) {
  return category.allocations.reduce(
    (total, allocation) => total + allocation.amount,
    0
  );
}

function getCategoryTypeBadgeClasses(type: CategoryType) {
  switch (type) {
    case "expense":
      return "border border-red-500/30 bg-red-500/15 text-red-300";
    case "savings":
      return "border border-green-500/30 bg-green-500/15 text-green-300";
    case "credit/debt":
      return "border border-amber-500/30 bg-amber-500/15 text-amber-300";
    default:
      return "border border-slate-700 bg-slate-800 text-slate-300";
  }
}

function getCategoryCardAccentClasses(type: CategoryType, isSelected: boolean) {
  if (isSelected) {
    switch (type) {
      case "expense":
        return "border-red-400 bg-red-500/10";
      case "savings":
        return "border-green-400 bg-green-500/10";
      case "credit/debt":
        return "border-amber-400 bg-amber-500/10";
      default:
        return "border-white bg-slate-800";
    }
  }

  return "border-slate-800 bg-slate-950";
}

export default function AllocationManagement({
  totalIncome,
}: AllocationManagementProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType | "">("");
  const [categoryError, setCategoryError] = useState("");

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryType, setEditCategoryType] = useState<CategoryType | "">(
    ""
  );
  const [editCategoryError, setEditCategoryError] = useState("");

  const [allocationName, setAllocationName] = useState("");
  const [allocationAmount, setAllocationAmount] = useState("");
  const [allocationError, setAllocationError] = useState("");

  const [editingAllocationId, setEditingAllocationId] = useState<string | null>(
    null
  );
  const [editAllocationName, setEditAllocationName] = useState("");
  const [editAllocationAmount, setEditAllocationAmount] = useState("");
  const [editAllocationError, setEditAllocationError] = useState("");

  const sortedCategories = useMemo(() => {
    const sorted = [...categories];

    sorted.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "total-high-low":
          return getCategoryTotal(b) - getCategoryTotal(a);
        case "total-low-high":
          return getCategoryTotal(a) - getCategoryTotal(b);
        default:
          return 0;
      }
    });

    return sorted;
  }, [categories, sortOption]);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const handleCreateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryError("");

    if (!categoryName.trim() || !categoryType) {
      setCategoryError("Category name and type are required.");
      return;
    }

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: categoryName.trim(),
      type: categoryType,
      allocations: [],
    };

    setCategories((prev) => [...prev, newCategory]);
    setSelectedCategoryId(newCategory.id);
    setCategoryName("");
    setCategoryType("");
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setEditCategoryType(category.type);
    setEditCategoryError("");
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryName("");
    setEditCategoryType("");
    setEditCategoryError("");
  };

  const handleSaveCategory = (categoryId: string) => {
    setEditCategoryError("");

    if (!editCategoryName.trim() || !editCategoryType) {
      setEditCategoryError("Category name and type are required.");
      return;
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            name: editCategoryName.trim(),
            type: editCategoryType,
          }
          : category
      )
    );

    cancelEditingCategory();
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(
      (category) => category.id === categoryId
    );

    const confirmed = window.confirm(
      `Delete "${categoryToDelete?.name ?? "this category"}" and all related allocations?`
    );

    if (!confirmed) return;

    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId)
    );

    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setEditingAllocationId(null);
    }

    if (editingCategoryId === categoryId) {
      cancelEditingCategory();
    }
  };

  const handleCreateAllocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAllocationError("");

    if (!selectedCategory) {
      setAllocationError("Select a category first.");
      return;
    }

    if (!allocationName.trim() || !allocationAmount.trim()) {
      setAllocationError("Allocation name and amount are required.");
      return;
    }

    const parsedAmount = Number(allocationAmount);

    if (Number.isNaN(parsedAmount)) {
      setAllocationError("Amount must be a valid number.");
      return;
    }

    if (parsedAmount < 0) {
      setAllocationError("Amount must be zero or greater.");
      return;
    }

    const newAllocation: Allocation = {
      id: crypto.randomUUID(),
      name: allocationName.trim(),
      amount: parsedAmount,
    };

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
            ...category,
            allocations: [...category.allocations, newAllocation],
          }
          : category
      )
    );

    setAllocationName("");
    setAllocationAmount("");
  };

  const startEditingAllocation = (allocation: Allocation) => {
    setEditingAllocationId(allocation.id);
    setEditAllocationName(allocation.name);
    setEditAllocationAmount(String(allocation.amount));
    setEditAllocationError("");
  };

  const cancelEditingAllocation = () => {
    setEditingAllocationId(null);
    setEditAllocationName("");
    setEditAllocationAmount("");
    setEditAllocationError("");
  };

  const handleSaveAllocation = (categoryId: string, allocationId: string) => {
    setEditAllocationError("");

    if (!editAllocationName.trim() || !editAllocationAmount.trim()) {
      setEditAllocationError("Allocation name and amount are required.");
      return;
    }

    const parsedAmount = Number(editAllocationAmount);

    if (Number.isNaN(parsedAmount)) {
      setEditAllocationError("Amount must be a valid number.");
      return;
    }

    if (parsedAmount < 0) {
      setEditAllocationError("Amount must be zero or greater.");
      return;
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            allocations: category.allocations.map((allocation) =>
              allocation.id === allocationId
                ? {
                  ...allocation,
                  name: editAllocationName.trim(),
                  amount: parsedAmount,
                }
                : allocation
            ),
          }
          : category
      )
    );

    cancelEditingAllocation();
  };

  const handleDeleteAllocation = (
    categoryId: string,
    allocationId: string,
    allocationNameToDelete: string
  ) => {
    const confirmed = window.confirm(
      `Delete allocation "${allocationNameToDelete}"?`
    );

    if (!confirmed) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            allocations: category.allocations.filter(
              (allocation) => allocation.id !== allocationId
            ),
          }
          : category
      )
    );

    if (editingAllocationId === allocationId) {
      cancelEditingAllocation();
    }
  };

  const totalAllocated = categories.reduce(
    (sum, category) => sum + getCategoryTotal(category),
    0
  );

  const remainingIncome = totalIncome - totalAllocated;

  return (
    <div>
      {/* <div className="mb-4 text-white">
        <p>Total Income: ${totalIncome.toFixed(2)}</p>
        <p>Allocated: ${totalAllocated.toFixed(2)}</p>
        <p>Remaining: ${remainingIncome.toFixed(2)}</p>
      </div> */}

      <h2 className={incomeStyles.title} style={{ textAlign: "center", marginBottom: "15px" }}>
        Net Income
      </h2>
      <div className={`${incomeStyles.card} flex flex-col max-w-md mx-auto mb-5`}>
          <p className={incomeStyles.title}> Remaining: ${remainingIncome.toFixed(2)}</p>
      </div>

      <div className="w-full text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="ml-4 text-3xl font-bold">Allocation Management</h1>
            <p className="mt-2 ml-4 text-sm text-slate-400">
              Create categories, organize your plan, and add allocations within
              each category.
            </p>
          </div>

          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              Create Allocation Category
            </h2>

            <form
              onSubmit={handleCreateCategory}
              className="grid gap-4 md:grid-cols-[1fr_220px_auto]"
            >
              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryType"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Category Type
                </label>
                <select
                  id="categoryType"
                  value={categoryType}
                  onChange={(e) =>
                    setCategoryType(e.target.value as CategoryType | "")
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                >
                  <option value="">Select type</option>
                  {categoryTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Create Category
                </button>
              </div>
            </form>

            {categoryError && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {categoryError}
              </div>
            )}
          </section>

          <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  All Allocation Categories
                </h2>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {categories.length} total
                </span>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="sortCategories"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Sort Categories
                </label>
                <select
                  id="sortCategories"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                >
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="type">Type</option>
                  <option value="total-high-low">
                    Total Amount (High to Low)
                  </option>
                  <option value="total-low-high">
                    Total Amount (Low to High)
                  </option>
                </select>
              </div>

              {sortedCategories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400">
                  No categories created yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedCategories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;
                    const isEditing = editingCategoryId === category.id;
                    const totalAmount = getCategoryTotal(category);

                    return (
                      <div
                        key={category.id}
                        className={`rounded-2xl border p-4 transition ${getCategoryCardAccentClasses(
                          category.type,
                          isSelected
                        )}`}
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Category Name
                              </label>
                              <input
                                type="text"
                                value={editCategoryName}
                                onChange={(e) =>
                                  setEditCategoryName(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Category Type
                              </label>
                              <select
                                value={editCategoryType}
                                onChange={(e) =>
                                  setEditCategoryType(
                                    e.target.value as CategoryType | ""
                                  )
                                }
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
                              >
                                <option value="">Select type</option>
                                {categoryTypeOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {editCategoryError && (
                              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {editCategoryError}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveCategory(category.id)}
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditingCategory}
                                className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedCategoryId(category.id)}
                              className="w-full text-left"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {category.name}
                                  </h3>
                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryTypeBadgeClasses(
                                        category.type
                                      )}`}
                                    >
                                      {category.type}
                                    </span>
                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                      {category.allocations.length} allocation
                                      {category.allocations.length === 1
                                        ? ""
                                        : "s"}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="text-xs uppercase tracking-wide text-slate-400">
                                    Total
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-200">
                                    {formatCurrency(totalAmount)}
                                  </p>
                                </div>
                              </div>
                            </button>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedCategoryId(category.id)}
                                className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                              >
                                View Allocations
                              </button>
                              <button
                                type="button"
                                onClick={() => startEditingCategory(category)}
                                className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="rounded-xl border border-red-500/40 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              {!selectedCategory ? (
                <div className="rounded-xl border border-dashed border-slate-700 px-4 py-10 text-center text-slate-400">
                  Select a category to view and create allocations.
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold">
                        {selectedCategory.name}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryTypeBadgeClasses(
                          selectedCategory.type
                        )}`}
                      >
                        {selectedCategory.type}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      Total allocated:{" "}
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(getCategoryTotal(selectedCategory))}
                      </span>
                    </p>
                  </div>

                  <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <h3 className="mb-4 text-lg font-semibold">
                      Create Allocation Within Category
                    </h3>

                    <form
                      onSubmit={handleCreateAllocation}
                      className="grid gap-4 md:grid-cols-[1fr_180px_auto]"
                    >
                      <div>
                        <label
                          htmlFor="allocationName"
                          className="mb-2 block text-sm font-medium text-slate-300"
                        >
                          Allocation Name
                        </label>
                        <input
                          id="allocationName"
                          type="text"
                          value={allocationName}
                          onChange={(e) => setAllocationName(e.target.value)}
                          placeholder="Enter allocation name"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="allocationAmount"
                          className="mb-2 block text-sm font-medium text-slate-300"
                        >
                          Amount
                        </label>
                        <input
                          id="allocationAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={allocationAmount}
                          onChange={(e) => setAllocationAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-slate-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                          Add Allocation
                        </button>
                      </div>
                    </form>

                    {allocationError && (
                      <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {allocationError}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Allocations</h3>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {selectedCategory.allocations.length} total
                      </span>
                    </div>

                    {selectedCategory.allocations.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-700 px-4 py-6 text-sm text-slate-400">
                        No allocations in this category yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedCategory.allocations.map((allocation) => {
                          const isEditingAllocation =
                            editingAllocationId === allocation.id;

                          return (
                            <div
                              key={allocation.id}
                              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4"
                            >
                              {isEditingAllocation ? (
                                <div className="space-y-3">
                                  <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                                    <div>
                                      <label className="mb-2 block text-sm font-medium text-slate-300">
                                        Allocation Name
                                      </label>
                                      <input
                                        type="text"
                                        value={editAllocationName}
                                        onChange={(e) =>
                                          setEditAllocationName(
                                            e.target.value
                                          )
                                        }
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-sm font-medium text-slate-300">
                                        Amount
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editAllocationAmount}
                                        onChange={(e) =>
                                          setEditAllocationAmount(
                                            e.target.value
                                          )
                                        }
                                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
                                      />
                                    </div>
                                  </div>

                                  {editAllocationError && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                      {editAllocationError}
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSaveAllocation(
                                          selectedCategory.id,
                                          allocation.id
                                        )
                                      }
                                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditingAllocation}
                                      className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="font-medium text-white">
                                      {allocation.name}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-sm font-semibold text-slate-200">
                                      {formatCurrency(allocation.amount)}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        startEditingAllocation(allocation)
                                      }
                                      className="rounded-xl border border-slate-600 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteAllocation(
                                          selectedCategory.id,
                                          allocation.id,
                                          allocation.name
                                        )
                                      }
                                      className="rounded-xl border border-red-500/40 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}