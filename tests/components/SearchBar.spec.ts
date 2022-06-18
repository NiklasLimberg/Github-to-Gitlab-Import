/**
 * @jest-environment jsdom
 */

import 'jest';
import { mount } from '@vue/test-utils'

import SearchBar from '../../components/SearchBar.vue'

function createWrapper() {
    return mount(SearchBar, {
        props: { 
            modelValue: 'Test value'
        },
    })
}


describe('SearchBar.vue', () => {
    test('updates when being typed in', async () => {
        const wrapper = createWrapper()
        const searchBox = wrapper.get('input')
        
        expect(searchBox.element.value).toBe('Test value')

        await searchBox.setValue('Test value!')

        const updateModelEvents = wrapper.emitted('update:modelValue')
        expect(updateModelEvents?.length).toEqual(1)

        expect(updateModelEvents?.at(0)).toEqual(['Test value!'])
    })

    test('updates value when property changes', async () => {
        // ... //
    })
})
