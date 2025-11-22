import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const primaryPurple = "#B431F4";
const secundaryColor = "#a4dc22ff";

const filterMenu = [
  { title: "Gênero", sub: ["Romance", "Terror", "Suspense"] },
  { title: "Autor" },
  { title: "Condição" },
  { title: "Promoções" },
];

const sortMenu = [
  { title: "Preço", sub: ["Maior", "Menor"] },
  { title: "Lançamento" },
];

export default function FilterSort({
  selectedFilter,
  setSelectedFilter,
  selectedSort,
  setSelectedSort,
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [openFilterSubmenu, setOpenFilterSubmenu] = useState(null);
  const [openSortSubmenu, setOpenSortSubmenu] = useState(null);

  return (
    <View style={styles.container}>
      {/* FILTRAR POR */}
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter ? styles.filterButtonActive : null,
          ]}
          onPress={() => {
            setShowFilterDropdown(!showFilterDropdown);
            setShowSortDropdown(false);
            setOpenFilterSubmenu(null);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              selectedFilter ? styles.buttonTextActive : null,
            ]}
          >
            Filtrar por
          </Text>
          <Feather
            name={showFilterDropdown ? "chevron-up" : "chevron-down"}
            size={16}
            color={selectedFilter ? primaryPurple : "white"}
          />
        </TouchableOpacity>

        {showFilterDropdown && (
          <View style={styles.dropdownMenu}>
            {filterMenu.map((m) => (
              <View key={m.title}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    openFilterSubmenu === m.title && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    if (m.sub) {
                      setOpenFilterSubmenu(
                        openFilterSubmenu === m.title ? null : m.title
                      );
                    } else {
                      setSelectedFilter(m.title);
                      setShowFilterDropdown(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedFilter === m.title && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {m.title}
                  </Text>

                  <Feather
                    name={
                      m.sub
                        ? openFilterSubmenu === m.title
                          ? "chevron-down"
                          : "chevron-right"
                        : "chevron-right"
                    }
                    size={18}
                    color={primaryPurple}
                  />
                </TouchableOpacity>

                {openFilterSubmenu === m.title && m.sub && (
                  <View style={styles.submenuContainer}>
                    {m.sub.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[
                          styles.dropdownSubItem,
                          selectedFilter === sub && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedFilter(sub);
                          setShowFilterDropdown(false);
                          setOpenFilterSubmenu(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedFilter === sub && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {sub}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ORDENAR POR */}
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            selectedSort ? styles.sortButtonActive : null,
          ]}
          onPress={() => {
            setShowSortDropdown(!showSortDropdown);
            setShowFilterDropdown(false);
            setOpenSortSubmenu(null);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              selectedSort ? styles.buttonTextActive : null,
            ]}
          >
            Ordenar por
          </Text>
          <Feather
            name={showSortDropdown ? "chevron-up" : "chevron-down"}
            size={16}
            color={selectedSort ? primaryPurple : "white"}
          />
        </TouchableOpacity>

        {showSortDropdown && (
          <View style={styles.dropdownMenu}>
            {sortMenu.map((m) => (
              <View key={m.title}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    openSortSubmenu === m.title && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    if (m.sub) {
                      setOpenSortSubmenu(
                        openSortSubmenu === m.title ? null : m.title
                      );
                    } else {
                      setSelectedSort(m.title);
                      setShowSortDropdown(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedSort === m.title && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {m.title}
                  </Text>

                  <Feather
                    name={
                      m.sub
                        ? openSortSubmenu === m.title
                          ? "chevron-down"
                          : "chevron-right"
                        : "chevron-right"
                    }
                    size={18}
                    color={primaryPurple}
                  />
                </TouchableOpacity>

                {openSortSubmenu === m.title && m.sub && (
                  <View style={styles.submenuContainer}>
                    {m.sub.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[
                          styles.dropdownSubItem,
                          selectedSort === sub && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedSort(sub);
                          setShowSortDropdown(false);
                          setOpenSortSubmenu(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedSort === sub && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {sub}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 10,
    zIndex: 50,
  },
  dropdownWrapper: {
    position: "relative",
    marginHorizontal: 8,
  },
  filterButton: {
    backgroundColor: primaryPurple,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    minWidth: 140,
  },
  sortButton: {
    backgroundColor: primaryPurple,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    minWidth: 140,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonTextActive: {
    color: primaryPurple,
    fontWeight: "700",
  },
  filterButtonActive: {
    backgroundColor: secundaryColor,
  },
  sortButtonActive: {
    backgroundColor: secundaryColor,
  },
  dropdownMenu: {
    position: "absolute",
    top: 44,
    left: 0,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownSubItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  submenuContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 6,
  },
  dropdownItemSelected: {
    backgroundColor: secundaryColor,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 15,
    color: primaryPurple,
    fontWeight: "600",
  },
  dropdownItemTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
});

