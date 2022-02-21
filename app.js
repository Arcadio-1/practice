class DOMHelper {
  static clearEventListeners(element) {
    //element is switchBtn
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
    element.scrollIntoView({ behavior: "smooth" });
  }
}

class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  detach() {
    if (this.element) {
      this.element.remove();
      // this.element.parentElement.removeChild(this.element);
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? "afterbegin" : "afterend",
      this.element
    );
  }
}

class Tooltip extends Component {
  constructor(closeNotifierFunction, extraText, id) {
    super(id); //this.id
    this.extraTExt = extraText;
    this.closeNotifier = closeNotifierFunction;
    this.create(this.extraTExt);
  }

  closeTooltip = () => {
    this.detach();
    this.closeNotifier();
  };

  create(text) {
    const tooltipElement = document.createElement("li");
    tooltipElement.className = "tool-tip";
    // tooltipElement.textContent = text;
    const tooltipTemplate = document.getElementById("tooltip-id");
    const tooltipBody = document.importNode(tooltipTemplate.content, true);
    // const tooltipBody = document.importNode(tooltipTemplate.content, true);

    tooltipBody.querySelector("p").textContent = text;
    tooltipElement.append(tooltipBody);

    tooltipElement.addEventListener("click", this.closeTooltip);
    this.element = tooltipElement;
  }
}

class ProjectItem {
  hasActiveTooltip = false;

  constructor(id, updateProjectListsFunction, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectMoreInfoButton();
    this.connectSwitchButton(type);
  }
  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const projectElement = document.getElementById(this.id);
    const tooltipText = projectElement.dataset.extraInfo;
    // console.log(`${tooltipText} this is tooltip text`);
    const tooltip = new Tooltip(
      () => {
        this.hasActiveTooltip = false;
      },
      tooltipText,
      this.id
    );
    tooltip.attach();
    // tooltip.create(tooltipText);
    this.hasActiveTooltip = true;
  }

  connectMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    const moreInfoBtn =
      projectItemElement.querySelector(`button:first-of-type`);

    moreInfoBtn.addEventListener("click", this.showMoreInfoHandler.bind(this));
  }
  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchBtn = projectItemElement.querySelector(`button:last-of-type`);
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === "active-sec" ? "Finish" : "Activate";

    switchBtn.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }
  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.connectSwitchButton(type);
  }
}

class ProojectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const projectItems = document.querySelectorAll(`.${type} li`);
    for (const projitem of projectItems) {
      this.projects.push(
        new ProjectItem(projitem.id, this.switchProject.bind(this), this.type)
      );
    }
    console.log(this.projects);
  }

  setSwitchHandlerFunctin(switchHandlerFunctin) {
    this.switchHandler = switchHandlerFunctin;
  }
  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `.${this.type} ul`);
    project.update(this.switchProject.bind(this), this.type);
  }
  switchProject(projectId) {
    this.switchHandler(this.projects.find((p) => p.id === projectId));
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }
}
/************** */
class App {
  static init() {
    const actives = new ProojectList("active-sec");
    const finishes = new ProojectList("finish-sec");
    actives.setSwitchHandlerFunctin(finishes.addProject.bind(finishes));
    finishes.setSwitchHandlerFunctin(actives.addProject.bind(actives));
    const timeoutId = setTimeout(this.anletic, 3000);
    const startScriptBnt = document.getElementById("show-script");
    startScriptBnt.addEventListener("click", () => {
      clearTimeout(timeoutId);
    });
  }
  static anletic() {
    const creatScript = document.createElement("script");
    creatScript.src = `./newApp.js`;
    creatScript.defer = true;
    document.head.append(creatScript);
  }
}

App.init();
