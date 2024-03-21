export const errors = {
	CFW_USER_AGENT_NOT_ALLOWED: {
		message: 'User-Agent not allowed.',
		code: 'CFW_USER_AGENT_NOT_ALLOWED',
		id: '01322a32-ddc4-40ae-9131-8e0cc728ecbd',
	},
	CFW_COUNTRY_NOT_ALLOWED: {
		message: 'Country not allowed.',
		code: 'CFW_COUNTRY_NOT_ALLOWED',
		id: 'a0847c43-ab4d-4a66-ba03-50181bafc597',
	},
	CFW_AS_NOT_ALLOWED: {
		message: 'AS not allowed.',
		code: 'CFW_AS_NOT_ALLOWED',
		id: '32f1d804-39e1-4540-a188-aaa09590fc5b',
	},
}

export function createError(code: keyof typeof errors) {
	return new Response(JSON.stringify({
		error: errors[code],
	}), {
		status: 400,
	})
}
