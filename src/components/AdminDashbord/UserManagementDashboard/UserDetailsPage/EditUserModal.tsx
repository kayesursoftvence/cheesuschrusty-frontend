/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserData } from './types';
import { useUpdateStudentMutation } from '@/redux/features/userManagement/usermanagementApi';
import { toast } from 'react-hot-toast';

interface EditUserModalProps {
    user: UserData;
    onClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose }) => {
    const [updateStudent, { isLoading }] = useUpdateStudentMutation();
    const [formData, setFormData] = useState({
        name: user.name || user.fullName,
        email: user.email,
        isActive: user.isActive,
        nativeLang: user.nativeLang,
        targetLang: user.targetLang,
        currentLevel: user.currentLevel,
        xp: user.xp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalMinutesStudied: user.totalMinutesStudied,
        wordsLearned: user.wordsLearned,
        lessonsCompleted: user.lessonsCompleted,
        dailyGoalMinutes: user.dailyGoalMinutes,
        timezone: user.timezone || '',
        weeklyUpdateEnabled: true, // Defaulting if not in type
        streakRemindersEnabled: true,
        achievementAlertsEnabled: true,
        hasUsedTrial: user.hasUsedTrial
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateStudent({
                id: user.id.toString(),
                ...formData,
                xp: Number(formData.xp),
                currentStreak: Number(formData.currentStreak),
                longestStreak: Number(formData.longestStreak),
                totalMinutesStudied: Number(formData.totalMinutesStudied),
                wordsLearned: Number(formData.wordsLearned),
                lessonsCompleted: Number(formData.lessonsCompleted),
                dailyGoalMinutes: Number(formData.dailyGoalMinutes),
            }).unwrap();
            toast.success('User updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update user');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Student Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Native language</label>
                        <input
                            name="nativeLang"
                            value={formData.nativeLang}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target language</label>
                        <input
                            name="targetLang"
                            value={formData.targetLang}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Level</label>
                        <select
                            name="currentLevel"
                            value={formData.currentLevel}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">XP Points</label>
                        <input
                            name="xp"
                            type="number"
                            value={formData.xp}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Daily Goal (Min)</label>
                        <input
                            name="dailyGoalMinutes"
                            type="number"
                            value={formData.dailyGoalMinutes}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Streak</label>
                        <input
                            name="currentStreak"
                            type="number"
                            value={formData.currentStreak}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2 border-t dark:border-gray-700 pt-4 flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Is Active</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="hasUsedTrial"
                                checked={formData.hasUsedTrial}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Has Used Trial</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="weeklyUpdateEnabled"
                                checked={formData.weeklyUpdateEnabled}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Weekly Updates</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="streakRemindersEnabled"
                                checked={formData.streakRemindersEnabled}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Streak Reminders</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="achievementAlertsEnabled"
                                checked={formData.achievementAlertsEnabled}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Achievement Alerts</span>
                        </label>
                    </div>

                    <div className="md:col-span-2 pt-6 border-t dark:border-gray-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
