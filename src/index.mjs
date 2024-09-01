import "./styles.css";

/**
 * Build a drag and drop file manager
 *
 *  - Display a hierarchical file system with folders and files,
 *    where folders can contain both files and other folders.
 *
 *  - Implement drag-and-drop to allow moving files and folders into
 *    different folders, ensuring files cannot contain other items.
 *
 *  - The contents within each folder should be sorted alphabetically,
 *    with folders listed first, followed by files.
 *
 */

const rootItem = {
  type: "folder",
  name: "Projects",
  children: [
    {
      type: "folder",
      name: "2024 Europe Trip",
      children: [
        {
          type: "file",
          name: "Itinerary.pdf",
        },
      ],
    },
    {
      type: "folder",
      name: "Travel Plans",
      children: [
        {
          type: "file",
          name: "Packing List.txt",
        },
      ],
    },
    {
      type: "file",
      name: "Resume.docx",
    },
    {
      type: "file",
      name: "Budget.xlsx",
    },
    {
      type: "file",
      name: "Presentation.pptx",
    },
  ],
};

const rootElement = document.getElementById("root");

function renderItem(item) {
  const element = document.createElement("div");

  element.classList.add(item.type === "folder" ? "folder" : "file");
  element.classList.add("draggable");
  element.draggable = true;

  element.innerHTML = `<div class="name">
    ${item.type === "folder" ? "🗂️" : "📄"} ${item.name}
  </div>`;

  if (item.type === "folder" && item.children.length > 0) {
    const childrenContainer = document.createElement("div");
    childrenContainer.classList.add("children-container");

    element.appendChild(childrenContainer);

    item.children.forEach((childItem) =>
      childrenContainer.appendChild(renderItem(childItem))
    );
  }

  return element;
}

rootElement.appendChild(renderItem(rootItem));

let dragging = null;
const draggableElements = [...document.querySelectorAll(".draggable")];

draggableElements.forEach((draggableElement) => {
  draggableElement.addEventListener("dragstart", (e) => {
    e.stopPropagation();

    dragging = draggableElement;
    draggableElement.style.opacity = 0.2;
  });

  draggableElement.addEventListener("dragend", (e) => {
    e.stopPropagation();

    dragging = null;
    draggableElement.style.opacity = 1;
  });
});

const dropTargetElements = [...document.querySelectorAll(".folder")];

dropTargetElements.forEach((dropTargetElement) => {
  dropTargetElement.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();

    dropTargetElement.style.background = "lightblue";
  });

  dropTargetElement.addEventListener("dragleave", (e) => {
    e.stopPropagation();
    e.preventDefault();

    dropTargetElement.style.background = "";
  });

  dropTargetElement.addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();

    dropTargetElement.style.background = "";

    if (dragging === dropTargetElement) {
      return;
    }

    const childrenContainerElement = dropTargetElement.lastChild;

    childrenContainerElement.appendChild(dragging);

    const sortedChildrenItems = [...childrenContainerElement.children].sort(
      (itemA, itemB) => {
        const isAFolder = [...itemA.classList].includes("folder");
        const isBFolder = [...itemB.classList].includes("folder");

        const itemAName = itemA.firstChild.textContent;
        const itemBName = itemB.firstChild.textContent;

        if (isAFolder && isBFolder) {
          return itemAName.localeCompare(itemBName);
        }

        if (isAFolder) {
          return -1;
        }

        if (isBFolder) {
          return 1;
        }

        return itemAName.localeCompare(itemBName);
      }
    );

    childrenContainerElement.innerHTML = "";
    sortedChildrenItems.forEach((sortedChildrenItem) =>
      childrenContainerElement.appendChild(sortedChildrenItem)
    );
  });
});
