import { Observable } from '@nativescript/core';
import { AIService } from '../services/ai-service';

export class StudyViewModel extends Observable {
    private aiService: AIService;
    private _question: string = '';
    private _answer: string = '';
    private _isLoading: boolean = false;
    private _hasError: boolean = false;
    private _errorMessage: string = '';

    constructor() {
        super();
        this.aiService = new AIService();
        this.checkAIService();
    }

    private checkAIService() {
        if (!this.aiService.isConfigured) {
            this._hasError = true;
            this._errorMessage = 'AI service is not configured. Please check the API key.';
            this.notifyPropertyChange('hasError', true);
            this.notifyPropertyChange('errorMessage', this._errorMessage);
        }
    }

    get question(): string {
        return this._question;
    }

    set question(value: string) {
        if (this._question !== value) {
            this._question = value;
            this.notifyPropertyChange('question', value);
        }
    }

    get answer(): string {
        return this._answer;
    }

    set answer(value: string) {
        if (this._answer !== value) {
            this._answer = value;
            this.notifyPropertyChange('answer', value);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    get hasError(): boolean {
        return this._hasError;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    async askQuestion() {
        if (!this.question.trim()) {
            this._hasError = true;
            this._errorMessage = 'Please enter a question';
            this.notifyPropertyChange('hasError', true);
            this.notifyPropertyChange('errorMessage', this._errorMessage);
            return;
        }

        this.isLoading = true;
        this._hasError = false;
        this.answer = '';
        this.notifyPropertyChange('hasError', false);

        try {
            const response = await this.aiService.getStudyHelp(this.question);
            if (response.success) {
                this.answer = response.message;
            } else {
                this._hasError = true;
                this._errorMessage = response.message;
                this.notifyPropertyChange('hasError', true);
                this.notifyPropertyChange('errorMessage', this._errorMessage);
            }
        } catch (error) {
            this._hasError = true;
            this._errorMessage = 'An unexpected error occurred. Please try again.';
            this.notifyPropertyChange('hasError', true);
            this.notifyPropertyChange('errorMessage', this._errorMessage);
        } finally {
            this.isLoading = false;
        }
    }

    clearAll() {
        this.question = '';
        this.answer = '';
        this._hasError = false;
        this._errorMessage = '';
        this.notifyPropertyChange('hasError', false);
        this.notifyPropertyChange('errorMessage', '');
    }
}