import { Observable } from '@nativescript/core';
import OpenAI from 'openai';

export class AIService extends Observable {
    private openai: OpenAI | null = null;
    private _isConfigured: boolean = false;

    constructor() {
        super();
        this.initializeOpenAI();
    }

    private initializeOpenAI() {
        try {
            this.openai = new OpenAI({
                apiKey: 'YOUR_API_KEY', // Store this securely
                dangerouslyAllowBrowser: true
            });
            this._isConfigured = true;
        } catch (error) {
            console.error('Failed to initialize OpenAI:', error);
            this._isConfigured = false;
        }
    }

    get isConfigured(): boolean {
        return this._isConfigured;
    }

    async getStudyHelp(prompt: string): Promise<{ success: boolean; message: string }> {
        if (!this.openai || !this._isConfigured) {
            return {
                success: false,
                message: 'AI service is not properly configured. Please check your API key.'
            };
        }

        try {
            const response = await this.openai.chat.completions.create({
                messages: [{ 
                    role: 'system', 
                    content: 'You are a helpful study assistant. Provide clear, concise explanations.'
                },
                { 
                    role: 'user', 
                    content: prompt 
                }],
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 500
            });

            return {
                success: true,
                message: response.choices[0].message.content || 'No response received'
            };
        } catch (error) {
            console.error('Error getting AI response:', error);
            return {
                success: false,
                message: 'Failed to get response from AI. Please try again later.'
            };
        }
    }
}