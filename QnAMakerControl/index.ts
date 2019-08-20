import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class QnAMakerControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Value of the field is stored and used inside the control 
	private _value:string;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;	
	private questionText: HTMLInputElement;
	private answerText: HTMLLabelElement;
	private button: HTMLButtonElement;
	private span: HTMLSpanElement;

	// Reference to the control container HTMLDivElement
	// This element contains all elements of our custom control example
	private _container: HTMLDivElement;
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this.span = document.createElement("span");	
		this.span.className = "fas fa-robot fa-2x span-bot-Style";

		//Creating an input element to get the question.
		this.questionText = document.createElement("input");
		this.questionText.setAttribute("type", "label");
		this.questionText.setAttribute("placeholder", context.resources.getString("QnAMakerControl_QuestionText_Placeholder"));		
		this.questionText.classList.add("question_Input_Style");

		//Creating a label element to display the answer.
		this.answerText = document.createElement("label");
		this.answerText.setAttribute("type", "label");		
		this.answerText.classList.add("answer_Input_Style");	
	
		//Creating a button element to fetch the answer.
		this.button = document.createElement("button");
		this.button.innerHTML = context.resources.getString("QnAMakerControl_ButtonLabel");
		this.button.classList.add("ask_Button_Style");
		this.button.addEventListener("click", this.onButtonClick.bind(this));

		// Adding all the elements created to the container DIV.
		this._container = document.createElement("div");
		this._container.appendChild(this.span);
		this._container.appendChild(this.questionText);
		this._container.appendChild(this.button);
		this._container.appendChild(this.answerText);		
		container.appendChild(this._container);

		this._notifyOutputChanged = notifyOutputChanged;
	}	

	/**
	 * Button Event handler for the button created as part of this control
	 * @param event
	 */
		private onButtonClick(event: Event): void 
		{
			//Fetch the answer from QnAMaker API
			fetch("https://yourhost.azurewebsites.net/qnamaker/knowledgebases/03d130ac-d295-488b-aaaa-bbbbc993411b2/generateAnswer", {
			method: "POST",
			body: JSON.stringify({ "question": this.questionText.value }),
			headers: {
				"Content-Type": "application/json",
				"Authorization": "EndpointKey 19a46459-your-key-9e72-7904f77d3466"
			},		

			}).then(res=>res.json())
			.then(res => {
				this._value = res.answers[0].answer; 
				this.answerText.innerText = this._value != null ? this._value.toString(): "";				
				this._notifyOutputChanged();}); 
		}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */  
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{		
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}